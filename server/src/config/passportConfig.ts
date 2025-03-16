import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

// Tip za Google profil
interface GoogleProfile {
  id: string;
  displayName: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
}

// Passport konfiguracija
export const setupPassport = () => {
  // Serijalizacija korisnika za sesiju
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserijalizacija korisnika iz sesije
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth strategija
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "http://localhost:5001/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile: GoogleProfile, done) => {
        try {
          // Tražimo postojećeg korisnika
          let user = await User.findOne({ googleId: profile.id });

          // Ako ne postoji, kreiramo novog korisnika
          if (!user) {
            const email =
              profile.emails && profile.emails[0]
                ? profile.emails[0].value
                : "";
            const profileImage =
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : "";

            user = await User.create({
              googleId: profile.id,
              email,
              displayName: profile.displayName,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              profileImage,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
};
