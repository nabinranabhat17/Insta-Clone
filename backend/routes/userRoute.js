import express from "express";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import cloudinary from "cloudinary";
import { promisify } from "util";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const uploadToCloudinary = promisify(cloudinary.v2.uploader.upload);

const router = express.Router();
router.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const upload = multer({ storage });

// Register a new user
router.post("/register", async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const user = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

//update user
router.put("/", verifyToken, upload.single("file"), async (req, res) => {
  const id = req.user.userId;
  const { fullname, username, email, password } = req.body;
  const filePath = req.file.path;
  const originalFileName = req.file.originalname;

  try {
    const result = await uploadToCloudinary(filePath, {
      public_id: originalFileName,
      resource_type: "image",
      format: path.extname(req.file.originalname).replace(".", ""), // Remove the dot from the extension
    });
    const profilePic = result.secure_url;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.profilePic = profilePic || user.profilePic;
    const updatedUser = await user.save();
    res.status(200).json({ success: "true", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//delete profilePic
router.get("/delete/profilepic", verifyToken, async (req, res) => {
  const id = req.user.userId;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePic =
      "https://res.cloudinary.com/dgsjbakvy/image/upload/v1728192486/rwhvbdg7vzby0ez20y5a.jpg";
    const updatedUser = await user.save();
    res.status(200).json({ success: "true", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    // Check password
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign({ userId: user._id }, "jwt-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", authToken: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Protected route example
router.get("/profile", verifyToken, async (req, res) => {
  const token = req.token;

  if (!token) {
    return res.status(401).json({ message: "Please authenticate" });
  }
  //get user from database
  try {
    const user = await User.findById(req.user.userId);
    res.json({ success: true, user: user });
  } catch (error) {
    res.json(`User not found ${error}`);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
