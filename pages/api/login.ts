import passport from "../../lib/passport-google-auth"
import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

export default nextConnect()
  .use(passport.initialize())
  .get(passport.authenticate("google", {
      scope: ["profile", "email"],
      //state: true
    },(req: NextApiRequest & { user: any }, res: NextApiResponse) => {

           // res.redirect("/dashboard");
      })
  );/*
export default nextConnect()
    .use(passport.initialize())
    .get(passport.authenticate("google", {
            scope: ["profile", "email"],
            state: true
        })
    );*/