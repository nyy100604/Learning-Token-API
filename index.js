import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";
const woodWorkingRoutr = routes.woodWorking;
const electricCircuitRoute = routes.electricCircuit;

mongoose
  .connect(process.env.CONNECT_DB)
  .then(() => {
    console.log("connect to MongoDB Altas.");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/woodWorking", woodWorkingRoutr);
app.use("/api/electricCircuit", electricCircuitRoute);

app.listen(3000, () => {
  console.log(`The app listening on port 3000`);
});
