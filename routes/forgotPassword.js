import express from "express";
import { registerCollections } from "./register.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter, mailOptions } from "../mail-utilities/mailer.js";

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
    const idforParam = findingUser.UserID;
    if (!findingUser) {
      return res.status(404).send({ error: "User not found" });
    } else if (findingUser.Token === true) {
      const token = jwt.sign(
        { UserID: findingUser.UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const verifyLink = `https://passwordresetbyraj.netlify.app/passwordreset/${idforParam}`;
      await transporter.sendMail({
        ...mailOptions,
        to: [mailOptions.to, mail],
        subject: "Password reset Link",
        text: `Click on the link below to reset your password:\n\n`,
        html: `<a href=${verifyLink}>Reset Password</a>`
      });
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
    else if (findingUser.Token === null) {
      const token = jwt.sign(
        { UserID: findingUser.UserID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      await registerCollections.updateOne(
        { UserID: findingUser.UserID },
        { $set: { Token: token } }
      );
      const verifyLink = `https://passwordresetbyraj.netlify.app/passwordreset/${idforParam}`;
      await transporter.sendMail({
        ...mailOptions,
        to: [mailOptions.to, mail],
        subject: "Password reset Link",
        text: `Click on the link below to reset your password:\n\n`,
        html: `<a href=${verifyLink}>Reset Password</a>`
      });
      res.status(200).send({
        msg: "Intiated but not changed password more than an hour so change again",
        idforParam,
      });
    } else {
      const verifyLink = `https://passwordresetbyraj.netlify.app/passwordreset/${idforParam}`;
      await transporter.sendMail({
        ...mailOptions,
        to: [mailOptions.to, mail],
        subject: "Password reset Link",
        text: `Click on the link below to reset your password:\n\n`,
        html: `<a href=${verifyLink}>Reset Password</a>`
      });
      {
        res
          .status(200)
          .send({ msg: "User Found Proceed to Password Reset", idforParam });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error: error });
  }
});

export default forgotRouter;
