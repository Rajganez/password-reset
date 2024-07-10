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
      { expiresIn: "1h" }
    );
    const verifyLink = `https://passwordresetbyraj.netlify.app/passwordreset/${idforParam}`;

    await transporter.sendMail({
      ...mailOptions,
      to: [mailOptions.to, mail],
      subject: "Password reset Link",
      text: `Click on the link below to reset your password:\n\n${verifyLink}`,
      html: `<a href=${verifyLink}>Reset Password</a>`,
    });

    await registerCollections.updateOne(
      { UserID: findingUser.UserID },
      { $set: { Token: token } }
    );

    if (findingUser.Token === null) {
      return res.status(200).send({
        msg: "Intiated but not changed password more than an hour, so please try resetting again",
        idforParam,
      });
    } else {
      return res.status(200).send({
        msg: "User Found. Proceed to Password Reset",
        idforParam,
      });
    }
  } catch (error) {
    return res.status(500).send({ msg: "Server Error", error: error.message });
  }
});

export default forgotRouter;
