const {Dialogs} = require('../../models/dialogs');
const {User} = require('../../models/user')

class DialogController {
  async createDialog(req, res) {
    const io = req.io
    const userOne = await User.findByPk(req.user.id)
    const userTwo = await User.findByPk(req.body.userId)
    if (!userTwo) {
      return res.status(400).json('Пользователь не найден')
    }
    const dialogs = await userOne.getDialogs()
    for (let i = 0; i < dialogs.length; i++) {
      const users = await dialogs[i].getUsers()
      if (users.length > 2) {
        continue
      }
      if (users.findIndex(el => el.id === userTwo.id) !== -1) {
        return res.status(200).json(users[0].User_Dialogs);
      }
    }
    const info = await Dialogs.create({})
    await info.addUser(userOne)
    await info.addUser(userTwo)
    const otherUser = {
      id: userTwo.id,
      firstName: userTwo.firstName,
      lastName: userTwo.lastName,
      avatarUrl: userTwo.avatarUrl,
      isOnline: userTwo.isOnline,
      lastSeen: userTwo.lastSeen,
    }
    const me = {
      id: userOne.id,
      firstName: userOne.firstName,
      lastName: userOne.lastName,
      avatarUrl: userOne.avatarUrl,
      isOnline: userOne.isOnline,
      lastSeen: userOne.lastSeen,
    }
    const userSocket = userTwo.socket;
    if (userSocket) {
      io.to(userSocket).emit('SERVER:NEW_DIALOG', {
        dialogId: info.id,
        user: me,
      });
    }
    io.to(req.user.socket).emit('SERVER:NEW_DIALOG', {
      dialogId: info.id,
      user: otherUser,
    });
    return res.status(201).json(info)
  }

  async getDialog(req, res) {
    const userId = req.user.id
    const user = await User.findByPk(userId)
    const dialogs = await user.getDialogs()
    const result = []
    for (let i = 0; i < dialogs.length; i++) {
      const users = await dialogs[i].getUsers()
      const userInfo = users.map((el) => ({
        id: el.id,
        firstName: el.firstName,
        lastName: el.lastName,
        avatarUrl: el.avatarUrl,
        isOnline: el.isOnline,
        lastSeen: el.lastSeen,
      })).filter(el => el.id !== userId)
      result.push({
        dialogId: dialogs[i].id,
        user: userInfo[0],
      })
    }
    return res.send(result)
  }
}

module.exports = new DialogController()