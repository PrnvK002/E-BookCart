const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const User = require('../models/user');
// const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = require('./config');


const GOOGLE_CLIENT_ID = "176096178607-pkjglbdrst38nr65mcmqo57t2cqfd96b.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
// console.log( process.env.GOOGLE_CLIENT_SECRET);
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID ,
    clientSecret: GOOGLE_CLIENT_SECRET ,
    callbackURL: "/auth/google/callback",
    passReqToCallback   : true
  },
  (request, accessToken, refreshToken, profile, done) => {
    console.log(profile);
    User.findOne({googleId : profile.id}).then((userData)=>{
      if(userData){
        console.log("User Already exists" + userData);
        done(null,userData);
      }
      else{

        User.create({
          googleId : profile.id,
          email : profile.emails[0].value,
          fullname : profile.displayName,
          image : profile.photos[0].value,
        }).then((data)=>{
          console.log(data);
          done(null,userData);
        })
      }
    })
    })
);

passport.serializeUser((user,done)=>{
  done(null,user._id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id).then((data)=>{
    done(null,data);
  })
});
