const {User} = require('../../models/user')

class ProfileController {
  async getProfile(req, res) {
    const user = await User.findByPk(req.params.id)
    if(!user) {
      return res.status(404).json("Пользователь не найден")
    }
    const sendUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    }
    console.log(sendUser)
    return res.status(200).json(sendUser)
  }
}

module.exports = new ProfileController()