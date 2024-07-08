import express from "express";
import { registerCollections } from "./register.js";

const logoutRouter = express.Router();

logoutRouter.post("/:userId", async (req, res) => {
  const signOut = req.body.outTime;
  const Id = req.params.userId;
  try {
    await registerCollections.updateOne(
      { UserID: Id },
      { $set: { SigOut: signOut } }
    );
    res.status(200).send({ msg: "Logged Out Successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error });
  }
});

export default logoutRouter;
