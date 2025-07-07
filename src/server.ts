import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://noteDB:EaeyMwI0AW4t7tSV@cluster0.bytzc92.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("connect to DB");
    server = app.listen(5000, () => {
      console.log("Server is Listing");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
