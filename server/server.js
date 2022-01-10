const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const {createServer} = require('http');
const {Server} = require('socket.io');
const passport = require('./core/passport')
const AuthController = require('./Controllers/AuthController')
const authRouter = require('./router/auth')
const dialogRouter = require('./router/dialog')
const messageRouter = require('./router/message')
const profileRouter = require('./router/profile')
require('./core/database')

dotenv.config({
  path: '.env',
});

const PORT = process.env.PORT || 4000

const app = express();

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser())
app.use(passport.initialize());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
})

require('./core/socket')(io);

app.use('/auth', authRouter)
app.use('/', dialogRouter)
app.use('/', messageRouter)
app.use('/', profileRouter)

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  (req, res) => {
    AuthController.authCallback(req, res)
  },
)


// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrap(passport.initialize()));
// io.use(wrap(passport.session()));
//
// io.use((socket, next) => {
//   if (socket.request.user) {
//     next();
//   } else {
//     next(new Error('unauthorized'))
//   }
// });

server.listen(PORT, () => {
  console.log(`Server RUNNED! on ${PORT} PORT`)
});
