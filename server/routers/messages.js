import express from "express";
import prisma from "../db/prisma.js";
const router = express.Router();

router.get("/conversations", async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const conversationMap = new Map();
    for (const msg of messages) {
      const other = msg.senderId === currentUserId ? msg.receiver : msg.sender;
      conversationMap.set(other.id, other);
    }

    res.json(Array.from(conversationMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});
router.get("/:id", async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.id;

  try {
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    const messages = msgs.map((msg) => ({
      ...msg,
      fromCurrentUser: msg.senderId === currentUserId,
    }));

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/:id", async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
