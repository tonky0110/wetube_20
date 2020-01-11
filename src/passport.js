import passport from "passport";
import FacebookStrategy from "passport-facebook";
import GithubStrategy from "passport-github";
import User from "./models/User";
import {
  facebookLoginCallback,
  githubLoginCallback
} from "./controllers/userController";
import routes from "./routes";

const FB_TUNNEL = "https://e8754ff6.ngrok.io";
passport.use(User.createStrategy());

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `http://localhost:4000${routes.gitHubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `${FB_TUNNEL}${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    facebookLoginCallback
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
