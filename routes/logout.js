import express from "express";
import { registerCollections } from "./register.js";

const logoutRouter = express.Router();

logoutRouter.get("/", async (req, res) => {
  try {
    await registerCollections.updateOne(
      { UserID: Id },
      { $set: { SigOut: Date().toString() } }
    );
    res.status(200).send({ msg: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error });
  }
});

export default logoutRouter;
