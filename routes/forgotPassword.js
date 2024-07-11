import express from "express";
import { registerCollections } from "./register.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { transporter, mailOptions } from "../mail-utilities/mailer.js";

dotenv.config();

const forgotRouter = express.Router();

// API to perform the forgot password operations for the user
forgotRouter.post("/", async (req, res) => {
  const mail = req.body.email;
  try {
    // Returns the user if the email is present in the DB
    const findingUser = await registerCollections.findOne(
      { email: mail },
      { projection: { _id: 0 } }
    );

    if (!findingUser) {
      return res.status(404).send({ error: "User not found" });
    }

    const idforParam = findingUser.UserID;
    const token = jwt.sign(
      { UserID: findingUser.UserID },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    if (findingUser.Token !== null && true) {
      const verifyLink = `https://passwordresetbyraj.netlify.app/passwordreset/${idforParam}`;
      await transporter.sendMail({
        ...mailOptions,
        to: [mailOptions.to, mail],
        subject: "Password reset Link",
        html: `Click on the link below to reset your password:Expires in 15m\n\n<a href=${verifyLink}>Reset Password</a>`,
      });
      res
        .status(200)
        .send({ msg: "Reset password link sent successfully", idforParam });
    }
    else if (findingUser.Token === null || true) {
      await registerCollections.updateOne(
        { UserID: findingUser.UserID },
        { $set: { Token: token } }
      );
      await transporter.sendMail({
        ...mailOptions,
        to: [mailOptions.to, mail],
        subject: "Password reset Link",
        html: `Click on the link below to reset your password: Expires in 15m\n\n<a href=${verifyLink}>Reset Password</a>`,
      });
      return res.status(200).send({
        msg: "Please chenck mail for reset password",
        idforParam,
      });
    } 
  } catch (error) {
    return res.status(500).send({ msg: "Server Error", error: error.message });
  }
});

export default forgotRouter;
