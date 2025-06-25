// In your users router (e.g., routers/users.js)

import express from "express";
import prisma from "../db/prisma.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        profilePic: true,
        posts: {
          include: {
            likes: true,
          },
          orderBy: { createdAt: "desc" },
        },
        sentRequests: true, // for followers count if you want
        receivedRequests: true, // for following count
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Optionally compute followers/following counts here:
    const followers = user.receivedRequests.filter(
      (f) => f.status === "ACCEPTED"
    ).length;
    const following = user.sentRequests.filter(
      (f) => f.status === "ACCEPTED"
    ).length;

    res.json({
      id: user.id,
      name: user.name,
      profilePic: user.profilePic,
      posts: user.posts,
      followers,
      following,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
