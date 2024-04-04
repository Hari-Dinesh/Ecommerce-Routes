import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoutes from "./Routes/UsersRoutes.js";
import ProductRoutes from "./Routes/ProductRoutes.js";
import OrderRoutes from "./Routes/OrdersRoute.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to the mongoose");
    app.use("/api", UserRoutes); //api=>authentication_Routes
    app.use("/products", ProductRoutes);
    app.use("/ord", OrderRoutes);//ord=>orders
    app.listen(process.env.PORT, () => {
      console.log(`port running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("error occured while starting the server");
  });
