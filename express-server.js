import express from "express";
import cors from "cors";
import connectToDB from "./db-utilities/mongo-db.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import forgotRouter from "./routes/forgotPassword.js";
import resetRouter from "./routes/passwordReset.js";
import logoutRouter from "./routes/logout.js";
import allDataRouter from "./routes/allUserData.js";

const app = express();
await connectToDB();
app.use(cors());
app.use(express.json());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/forgotpassword", forgotRouter);
app.use("/passwordreset", resetRouter);
app.use("/logout", logoutRouter);
app.use("/dashboard", allDataRouter);

const port = 8000;
app.listen(port, () => {
  console.log(`${Date().toString()} -- Server is running on port : ${port}`);
});
