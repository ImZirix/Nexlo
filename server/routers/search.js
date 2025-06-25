import express from "express";
import prisma from "../db/prisma.js";
const router = express();

router.get("/users", async (req, res) => {
  const query = req.query.query;
  const excludeId = req.query.excludeId;
  if (!query || query.trim() === "") {
    return res.json([]);
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        NOT: {
          id: excludeId,
        },
      },
      select: {
        id: true,
        name: true,
        profilePic: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
