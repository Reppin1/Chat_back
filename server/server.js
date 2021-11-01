const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const {User} = require('../models')
const passport = require('./core/passport')
require('./core/database')

dotenv.config({
  path: '.env',
});

const PORT = process.env.PORT || 4000

const app = express();

app.use(express.json())
app.use(cors());
app.use(cookieParser())
app.use(passport.initialize());

app.get('/', function (req, res) {
  res.send('Туда сюда ЧИХ ПЫХ')
})

app.post('/create', async (req, res) => {
  try {
    await User.create({
      firstName: "Denis",
      lastName: "Goncharov",
      email: "denis@gmail.com",
      password: "12345",
      avatarUrl: "http:photoUrl",
      isActive: false,
    })
    res.status(201).json('Данные отправились в бд')
  } catch (err) {
    res.status(500).json('Ошибка при отправке в бд')
  }
})

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  (req, res) => {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user,
      )}', '*');window.close();</script>`,
    );
  }
)

app.listen(PORT, () => {
  console.log(`Server RUNNED! on ${PORT} PORT`)
});