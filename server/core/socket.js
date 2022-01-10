const {User} = require('../../models/user')
const jwt = require('jsonwebtoken');

module.exports = function (io) {
  io.on('connection', async (socket) => {
    const token = parseCookies(socket).token;
    if (token) {
      const {user} = jwt.verify(token, process.env.JWT_SECRET_KEY)
      await User.update({socket: socket.id, isOnline: true}, {where: {email: user}})
    }
    socket.on('disconnect', async () => {
      const {user} = jwt.verify(token, process.env.JWT_SECRET_KEY)
      await User.update({socket: '', lastSeen: new Date(), isOnline: false}, {where: {email: user}})
    })
  })
};

function parseCookies(request) {
  const list = {},
    rc = request.handshake.headers.cookie;

  rc && rc.split(';').forEach(function (cookie) {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = unescape(parts.join('='));
  });

  return list;
}