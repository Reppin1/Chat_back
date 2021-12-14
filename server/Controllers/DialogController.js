const {Dialogs} = require("../../models/dialogs");
const {User} = require('../../models/user')

class DialogController {
  async createDialog(req, res) {
    const userOne = await User.findByPk(req.user.id)
    const userTwo = await User.findByPk(req.body.userId)
    if(!userTwo) {
      return res.status(400).json("Пользователь не найден")
    }
    const dialogs = await userOne.getDialogs()
    for(let i = 0; i < dialogs.length; i++) {
      const users = await dialogs[i].getUsers()
      if(users.length > 2) {
        continue
      }
      if(users.findIndex(el => el.id === userTwo.id) !== -1) {
        return res.status(409).json("Диалог уже существует")
      }
    }

    const info = await Dialogs.create({})
    await info.addUser(userOne)
    await info.addUser(userTwo)
    return res.status(201).json(info)
  }

  async getDialog(req, res) {
    const userId = req.user.id
    const info = await User.findByPk(userId)
    const dialogs = await info.getDialogs()
    const result = []
    for (let i = 0; i < dialogs.length; i++) {
      const users = await dialogs[i].getUsers()
      const usersInfo = users.map((el) => ({
        id: el.id,
        firstName: el.firstName,
        lastName: el.lastName,
        avatarUrl: el.avatarUrl
      })).filter(el => el.id !== userId)
      result.push({
        dialogId: dialogs[i].id,
        users: usersInfo,
      })
    }
    return res.send(result)
  }
}

module.exports = new DialogController()