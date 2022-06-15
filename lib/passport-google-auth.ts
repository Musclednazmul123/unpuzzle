import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

// logic to save your user or check if user exists in your record to proceed.
const saveUser = (user: Profile) => {
  return new Promise((resolve, reject) => {
    resolve("Successful");
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string ||'547315084191-k0oq33vtglbsvgtli8sbuqpjrrabrrch.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || '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',
      callbackURL: "http://localhost:3000", // callback url on our app to verify authentication.
    },
    async (_accessToken, _refreshToken, profile, cb: any) => {
      try {
        await saveUser(profile);
        return cb(null, profile);
      } catch (e: any) {
        throw new Error(e);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.deserializeUser(function (
  user: any,
  cb: (arg0: null, arg1: any) => any
) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passport;
