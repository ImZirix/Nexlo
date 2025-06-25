import express from "express";
import prisma from "../db/prisma.js";
import upload from "../utils/upload.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id; // assuming auth middleware sets req.user

  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const post = await prisma.post.create({
      data: {
        content,
        authorId: userId,
        ...(imageUrl && { imageUrl }),
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.post("/:id/like", async (req, res) => {
  const postId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const existing = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { userId, postId },
      });
      return res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});
router.get("/:id/comments", async (req, res) => {
  const postId = req.params.id;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { name: true }, // So we can show the commenter name
        },
      },
    });

    res.json(comments);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const authorId = req.user?.id;

  if (!authorId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: {
          select: { name: true }, // to return commenter's name
        },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Failed to post comment:", err);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

export default router;
