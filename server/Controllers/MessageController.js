const {Message} = require('../../models/messages');
const {Dialogs} = require('../../models/dialogs');
const {User} = require('../../models/user');

class MessageController {
  async createMessage(req, res) {
    const io = req.io
    const dialog = await Dialogs.findByPk(req.body.dialogId)
    const user = await User.findByPk(req.user.id)
    if (!dialog) {
      return res.status(400).json('Диалог не существует')
    }
    const message = await Message.create({
      UserId: user.id,
      DialogId: dialog.id,
      text: req.body.text,
    })
    const userTwo = await dialog.getUsers();
    const usersInfo = userTwo.map((el) => ({
      id: el.id,
      firstName: el.firstName,
      lastName: el.lastName,
      avatarUrl: el.avatarUrl,
      socket: el.socket,
    })).filter(el => el.id !== req.user.id)
    if (usersInfo[0].socket) {
      io.to(usersInfo[0].socket).emit('SERVER:NEW_MESSAGE', message);
    }
    io.to(req.user.socket).emit('SERVER:NEW_MESSAGE', message);
    return res.status(201).json(message)
  }

  async getMessages(req, res) {
    const io = req.io
    const userId = req.user.id
    const dialog = await Dialogs.findByPk(req.query.dialogId)
    if (!dialog) {
      return res.status(404).json('Диалог не существует')
    }
    const result = []
    const users = await dialog.getUsers()
    const usersInfo = users.map((el) => ({
      id: el.id,
      firstName: el.firstName,
      lastName: el.lastName,
      avatarUrl: el.avatarUrl,
      socket: el.socket,
    })).filter(el => el.id !== userId)
    const messages = await Message.findAll({
      where: {
        DialogId: dialog.id,
      },
      order : [['id', 'ASC']]
    })
    result.push({
      user: usersInfo[0],
      message: messages,
    })
    if (messages) {
      await Message.update(
        {read: true},
        {
          where:
            {
              DialogId: dialog.id,
              UserId: usersInfo[0].id,
            },
        })
    }
    if (usersInfo[0].socket) {
      io.to(usersInfo[0].socket).emit('SERVER:READ_MESSAGES')
    }
    return res.status(200).json(result)
  }
}

module.exports = new MessageController()
