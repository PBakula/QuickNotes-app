import express, { Request, Response, Router } from "express";
import passport from "passport";

const router = express.Router();

// Google OAuth inicijalizacija
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login",
    successRedirect: process.env.CLIENT_URL + "/notes/", // Preusmjeri na dashboard nakon uspješne prijave
  })
);

// Provjera autentikacije korisnika
router.get("/current-user", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Odjava
router.get("/logout", (req: Request, res: Response, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Ovdje brišemo sesiju nakon uspješne odjave
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      // Preusmjeravamo korisnika na login stranicu nakon što se sesija izbriše
      res.redirect("/login");
    });
  });
});

export default router;
