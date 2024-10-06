import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import postRoute from "./routes/postRoute.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://insta-clone-frontend-f3ib.onrender.com", // Specify the frontend URL
    credentials: true, // Enable sending cookies with CORS
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://root:root@learn-db.xako9zs.mongodb.net/?retryWrites=true&w=majority&appName=learn-db"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/user", userRoute);
app.use("/post", postRoute);
app.use(cookieParser());
// Basic route
app.get("/", (req, res) => {
  res.send("Hello, MERN Stack!");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
