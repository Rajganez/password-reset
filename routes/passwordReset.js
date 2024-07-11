import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerCollections } from "./register.js";

dotenv.config();

const resetRouter = express.Router();

// API to reset the password
resetRouter.post("/:idforParam", async (req, res) => {
  const newPassword = req.body.newPassword;
  const tokenFromUser = req.params.idforParam;

  try {
    // Find the user by the token
    const user = await registerCollections.findOne(
      { UserID: tokenFromUser },
      { projection: { _id: 0 } }
    );

    if (!user) {
      return res.status(404).json({ msg: "Invalid token or user not found" });
    }

    if(user) {
    // Verify the token
    jwt.verify(user.Token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        await registerCollections.updateOne(
          { UserID: user.UserID },
          { $set: { Token: null } }
        );
        return res.status(401).json({
          msg: "Token expired. Please try to reset with email again.",
          error: err.message,
        });
      }
      if (!err){
      // Hash the new password and update the user's password
      bcrypt.hash(newPassword, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({ msg: "Something went wrong", error: err.message });
        }

        await registerCollections.updateOne(
          { UserID: user.UserID },
          { $set: { password: hash, confirmPassword: hash } }
        );

        return res.status(200).json({ msg: "Password reset successful" });
      });
    }
    });
  }
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

export default resetRouter;
