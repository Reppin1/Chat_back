const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const {User} = require('../../models')
const dotenv = require("dotenv");
const {ExtractJwt} = require("passport-jwt");

dotenv.config({
  path: '.env',
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use('jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({where: {
          email: jwt_payload.user
        }})
      if(user) {
        done(null, user);
      } else {
        done(null, false)
      }
    } catch (e) {
      console.log(e)
    }
  }),
);

passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
  },
  (_, __, profile, done) => {
    try {
      const userData = {
        fullName: profile.displayName || '',
        avatarUrl: profile.photos?.[0].value,
        isActive: false,
        password: '',
        email: '',
      }
      return done(null, {
        userData,
      })
    } catch (err) {
      return done(err)
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user)
});

module.exports = passport
