import express from "express";
import bcrypt from "bcrypt";
import { registerCollections } from "./register.js";

const loginRouter = express.Router();
//API to check the login details are available in DB
loginRouter.post("/", async (req, res) => {
  const mail = req.body.email;
  const pass = req.body.password;

  try {
    //With Email from user finds the user details in the database
    const user = await registerCollections.findOne(
      { email: mail },
      { projection: { _id: 0 } }
    );
    //Returns Erro if user is not found
    if (!user) return res.status(404).json({ msg: "User not found" });
    //Compares Encrypted password and alows the user
    bcrypt.compare(pass, user.password, (err, result) => {
      if (result) {
        res.status(200).json({ msg: "Logged in successfully" });
      } else {
        res.status(401).json({ msg: "Invalid credentials" });
      }
    });
  } catch (error) {}
});

export default loginRouter;
