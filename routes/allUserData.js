import express from "express";
import { registerCollections } from "./register.js";

const allDataRouter = express.Router();

allDataRouter.get("/:UserId", async (req, res) => {
  const id = req.params.UserId;
  try {
    const data = await registerCollections.findOne(
      { UserID: id },
      { projection: { _id : 0 } }
    );
    res.status(200).send({ msg: "Retreived Successfully", data });
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error });
  }
});

export default allDataRouter;
