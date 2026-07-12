import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

// 1. Explicitly define the connection logic first
const connectDB = async() => {
    try {
        // Explicitly pass the connection string. 
        // Ensure you replace 'yourUsername' and 'yourActualPassword' with your real credentials.
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}

// 2. Start the server and call the database function
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB(); 
});