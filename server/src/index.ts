import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import { setupPassport } from "./config/passportConfig";
import noteRoutes from "./routes/noteRoutes";
import authRoutes from "./routes/authRoutes";
import { protectRoute } from "./middleware/authMiddleware";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(
  cors({
    origin: process.env.CLIENT_URL || "",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 dan
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
setupPassport();

app.use("/api/auth", authRoutes);
app.use("/api/notes", protectRoute, noteRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
