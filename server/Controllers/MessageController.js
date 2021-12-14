const {Message} = require('../../models/messages');
const {Dialogs} = require('../../models/dialogs');
const {User} = require('../../models/user');

class MessageController {
  async createMessage(req, res) {
    const dialog = await Dialogs.findByPk(req.body.dialogId)
    const user = await User.findByPk(req.user.id)
    if(!dialog) {
      return res.status(400).json('Диалог не существует')
    }
    const message = await Message.create({
      text: req.body.text
    })
    await message.addUser(user)
    await dialog.addMessage(message)
    return res.status(201)
  }

  async getMessages() {

  }
}

module.exports = new MessageController()