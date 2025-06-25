import express from "express";

import { register, login } from "../controllers/auth.js";

import prisma from "../db/prisma.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
});
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});
router.get("/stats/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [followersCount, followingCount, postsCount] = await Promise.all([
      prisma.follow.count({
        where: { receiverId: userId, status: "ACCEPTED" },
      }),
      prisma.follow.count({
        where: { senderId: userId, status: "ACCEPTED" },
      }),
      prisma.post.count({
        where: { authorId: userId },
      }),
    ]);

    res.json({
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
