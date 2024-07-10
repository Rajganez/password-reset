import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerCollections } from "./register.js";

dotenv.config();

const resetRouter = express.Router();
//API to reset the password
resetRouter.post("/:token", async (req, res) => {
  const newPass = req.body.newPassword;
  const tokenFromUSer = req.params.token;
  try {
    //UserID is passed as the Params
    const oldPass = await registerCollections.findOne(
      { Token: tokenFromUSer },
      { projection: { _id: 0 } }
    );
    //JWT to perform the token is expired or not
    //If Expired then Token is set to null
    if (oldPass.Token !== 0) {
      jwt.verify(
        tokenFromUSer,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            res.status(401).json({
              msg: "Token Expired try to reset with Email again!!",
              err: err,
            });
            await registerCollections.updateOne(
              { UserID: oldPass.UserID },
              { $set: { Token: null } }
            );
          }
          //New token will be generated once the user starts from forgotPassword page
          else {
            bcrypt.hash(newPass, 10, async (err, hash) => {
              if (err) {
                res.status(500).send({ msg: "Something went wrong", err });
              } else {
                await registerCollections.updateOne(
                  { UserID: oldPass.UserID },
                  { $set: { password: hash, confirmPassword: hash } }
                );
                res.status(200).json({ msg: "Password reset successful" });
              }
            });
          }
        }
      );
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error });
  }
});

export default resetRouter;
