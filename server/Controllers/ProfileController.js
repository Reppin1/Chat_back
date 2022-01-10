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
      isOnline: user.isOnline,
      socket: user.socket,
      lastSeen: user.lastSeen,
      aboutMe: user.aboutMe,
    }
    return res.status(200).json(sendUser)
  }

  async updateAboutMe(req, res) {
    const user = await User.findByPk(req.user.id);
    const about = req.body.about;
    if (!user) {
      return res.status(404).json("Пользователь не найден");
    }
    if (!about) {
      return res.status(204)
    }
    await User.update({aboutMe: about}, {where: {id: user.id}})
    return res.status(200).json("OK");
  }
}

module.exports = new ProfileController()