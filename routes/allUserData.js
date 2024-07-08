import express from "express";
import { registerCollections } from "./register.js";

const allDataRouter = express.Router();

allDataRouter.get("/", async (req, res) => {
  try {
    const data = await registerCollections.find({}, { projection: { _id } });
    res.status(200).send({ msg: "Retreived Successfully", data });
  } catch (error) {
    res.status(500).send({ msg: "Server Error", error });
  }
});

export default allDataRouter;
