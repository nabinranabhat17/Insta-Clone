// routes/postRoutes.js
import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import { verifyToken } from "../middleware/auth.js";
import { promisify } from "util";
import cookieParser from "cookie-parser";
import User from "../models/User.js";
import path from "path";
import fs from "fs";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const uploadToCloudinary = promisify(cloudinary.v2.uploader.upload);

cloudinary.v2.config({
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

const upload = multer({ storage: storage });

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const originalFileName = req.file.originalname;
  const caption = req.body.caption;
  const user = req.user.userId; // Assuming you have user information in req.user
  try {
    const result = await uploadToCloudinary(filePath, {
      public_id: originalFileName,
      resource_type: "image",
      format: path.extname(req.file.originalname).replace(".", ""), // Remove the dot from the extension
    });

    // Delete the file from local storage after upload

    const newPost = new Post({ caption, image: result.secure_url, user });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .populate("comments.user", "username");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/file/:filename", async (req, res) => {
  const { filename } = req.params;
  try {
    const result = await cloudinary.v2.search
      .expression(`public_id:uploads/${filename}`)
      .execute();
    if (result.resources.length > 0) {
      res.json(result.resources[0]);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.find({ user: req.params.id })
      .populate("user", "username")
      .populate("comments.user", "username");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a post by ID
router.put("/:id", verifyToken, async (req, res) => {
  const { caption, image, like } = req.body;
  const userId = req.user.userId;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (like) {
      if (post.likes.includes(userId)) {
        post.likes = post.likes.remove(userId);
      } else {
        post.likes.push(req.user.userId);
      }
    }
    post.caption = caption || post.caption;
    post.image = image || post.image;
    const updatedPost = await post.save();
    res.status(200).json({ updatedPost, userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post by ID
router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }
    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/comments/:id", verifyToken, async (req, res, next) => {
  const { userId, text } = req.body;
  const user = await User.findById(userId);
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ user, text });
    try {
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
      console.log(updatedPost);
    } catch (error) {
      console.log("failed to save", error);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/comments/:id", async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId)
      .populate({
        path: "comments.user",
        select: "username", // select only the username field from the user document
      })
      .populate({
        path: "user",
        select: "username email fullname", // select fields you want to include from the user document
      });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: "couldn't find post", error });
  }
});

export default router;
