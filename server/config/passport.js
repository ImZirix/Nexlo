import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "../db/prisma.js";

export default function configurePassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user)
            return done(null, false, { message: "Incorrect credentials" });

          const valid = await bcrypt.compare(password, user.password);

          if (!valid)
            return done(null, false, { message: "Incorrect credentials" });

          return done(null, user);
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
