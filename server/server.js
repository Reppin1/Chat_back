const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const passport = require('./core/passport')
const AuthController = require('./Controllers/AuthController')
const authRouter = require('./router/auth')
const dialogRouter = require('./router/message')
require('./core/database')

dotenv.config({
  path: '.env',
});

const PORT = process.env.PORT || 4000

const app = express();

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser())
app.use('/auth', authRouter)
// app.use('/dialog', dialogRouter)
app.use(passport.initialize());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  (req, res) => {
    AuthController.authCallback(req, res)
  }
)

app.listen(PORT, () => {
  console.log(`Server RUNNED! on ${PORT} PORT`)
});