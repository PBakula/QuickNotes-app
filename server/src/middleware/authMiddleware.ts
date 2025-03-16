import { Request, Response, NextFunction } from "express";

// Middleware za provjeru je li korisnik autentificiran
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

// Middleware za zaštitu ruta koje zahtijevaju autentikaciju
export const protectRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // Za API rute vraćamo JSON
  if (req.path.startsWith("/api/")) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  // Za ostale rute preusmjeravamo na login
  res.redirect("/login");
};
