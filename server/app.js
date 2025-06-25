import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import configurePassport from "./config/passport.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authRoutes from "./routers/auth.js";
import postsRoutes from "./routers/posts.js";
import searchRoutes from "./routers/search.js";
import messagesRoutes from "./routers/messages.js";
import usersRouter from "./routers/users.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/search", searchRoutes);
app.use("/messages", messagesRoutes);
app.use("/users", usersRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on 3000");
});
