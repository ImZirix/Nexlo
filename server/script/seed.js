import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Clear data in order to avoid foreign key conflicts
  await prisma.message.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  // Hash password once
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        name: "Alice",
        password: passwordHash,
        profilePic: "https://i.pravatar.cc/150?img=1",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        name: "Bob",
        password: passwordHash,
        profilePic: "https://i.pravatar.cc/150?img=2",
      },
    }),
    prisma.user.create({
      data: {
        email: "carol@example.com",
        name: "Carol",
        password: passwordHash,
        profilePic: "https://i.pravatar.cc/150?img=3",
      },
    }),
  ]);

  // Create posts by each user
  const posts = await Promise.all(
    users.map((user, i) =>
      prisma.post.create({
        data: {
          content: `This is post #${i + 1} by ${user.name}`,
          authorId: user.id,
        },
      })
    )
  );

  // Create comments: each user comments on next user's post
  await prisma.comment.createMany({
    data: [
      {
        content: "Nice post!",
        postId: posts[1].id,
        authorId: users[0].id,
      },
      {
        content: "Great thoughts!",
        postId: posts[2].id,
        authorId: users[1].id,
      },
      {
        content: "Thanks for sharing!",
        postId: posts[0].id,
        authorId: users[2].id,
      },
    ],
  });

  // Likes: all users like post #1
  await Promise.all(
    users.map((user) =>
      prisma.like.create({
        data: {
          postId: posts[0].id,
          userId: user.id,
        },
      })
    )
  );

  // Create follow relationships
  await prisma.follow.create({
    data: {
      senderId: users[0].id,
      receiverId: users[1].id,
      status: "ACCEPTED",
    },
  });
  await prisma.follow.create({
    data: {
      senderId: users[1].id,
      receiverId: users[2].id,
      status: "PENDING",
    },
  });

  // Create messages exchanged between users
  await prisma.message.createMany({
    data: [
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        content: "Hey Bob, how are you?",
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        content: "Hi Alice! I'm good, thanks. You?",
      },
      {
        senderId: users[1].id,
        receiverId: users[2].id,
        content: "Hey Carol, wanna catch up later?",
      },
      {
        senderId: users[2].id,
        receiverId: users[1].id,
        content: "Sure Bob, let's do it!",
      },
    ],
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
