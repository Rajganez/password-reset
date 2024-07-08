import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db-utilities/mongo-db.js";

const registerRouter = express.Router();
//DB collection to perform all API endpoints
const registerCollections = db.collection("Registrations");

//API to store registration details of the user in the database
registerRouter.post("/", async (req, res) => {
  const payload = req.body;
  try {
    //Hash the password before storing it in the database
    bcrypt.hash(payload.password, 10, async (err, hash) => {
      if (err) {
        res.status(500).send({ msg: "Something went wrong", err });
      } else {
        const tempData = {
          ...payload,
          password: hash,
          confirmPassword: hash,
        };
        //Insert the Unique userID into the database
        await registerCollections.insertOne({
          ...tempData,
          UserID: Date.now().toString(),
          Token: true
        });
      }
    });

    res.status(201).send({ msg: "Registration was successful" });
  } catch (error) {
    res.status(500).send({ msg: "Server error: ", error });
  }
});

export { registerCollections };
export default registerRouter;
