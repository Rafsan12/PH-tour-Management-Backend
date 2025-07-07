import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://tourDB:hKjV1NQOMlc3m8vf@cluster0.bytzc92.mongodb.net/tour-DB?retryWrites=true&w=majority&appName=Cluster0`
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
