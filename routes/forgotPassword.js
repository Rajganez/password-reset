import express from "express";
import { registerCollections } from "./register.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const forgotRouter = express.Router();
//API to perform the forgot password operations for the user
forgotRouter.post("/", async (req, res) => {
  const mail = req.body.email;
  try {
    //Returns the user if the email present in the DB
    const findingUser = await registerCollections.findOne(
      { email: mail },
      { projection: { _id: 0 } }
    );
    if (!findingUser) {
      return res.status(404).send({ error: "User not found" });
    } else if (findingUser.Token === true) {
      const idforParam = findingUser.UserID;
      const token = jwt.sign(
        { UserID: findingUser.UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      await registerCollections.updateOne(
        { UserID: findingUser.UserID },
        { $set: { Token: token } }
      );
      return res
        .status(200)
        .send({ msg: "User Found Proceed to Password Reset", idforParam });
    }
    //If token is expired, user token will be set to null
    //Then the new password will be replaced
    else if (findingUser.Token !== null ) {
      res
        .status(200)
        .send({ msg: "User Found Proceed to Password Reset", idforParam });
    } else if (findingUser.Token === null) {
      const token = jwt.sign(
        { UserID: findingUser.UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      await registerCollections.updateOne(
        { UserID: findingUser.UserID },
        { $set: { Token: token } }
      );
      res.status(200).send({
        msg: "Intiated but not changed password more than an hour so change again",
        idforParam,
      });
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error });
  }
});

export default forgotRouter;
