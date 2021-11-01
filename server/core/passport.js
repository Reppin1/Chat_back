const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const {User} = require('../../models')
const dotenv = require("dotenv");
const {ExtractJwt} = require("passport-jwt");
// const createJwtToken = require("../../utils/createJwtToken");

dotenv.config({
  path: '.env',
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use('jwt',
  new JwtStrategy(opts, function (jwt_payload, done) {
    done(null, jwt_payload.data);
  }),
);

passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      const userData = {
        firstName: profile.displayName.split(' ')[0],
        lastName: profile.displayName.split(' ')[1],
        avatarUrl: profile.photos?.[0].value || '',
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
  done(null, user);
});

module.exports = passport
