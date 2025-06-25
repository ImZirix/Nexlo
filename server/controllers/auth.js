import passport from "passport";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ error: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  res.status(201).json({ message: "User registered", userId: user.id });
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({
        message: "Logged in",
        user: { id: user.id, email: user.email, name: user.name },
      });
    });
  })(req, res, next);
};
