const {User} = require('../../models/user')
const {Code} = require('../../models/code')
const generateRandomCode = require('../../utils/generateRandomCode')
const MailService = require('../service/mail-service')
const createJwtToken = require("../../utils/createJwtToken");
const dotenv = require("dotenv");

dotenv.config({
  path: '../.env',
});

class AuthController {
  authCallback(req, res) {
    try {
      res.send(
        `<script>window.opener.postMessage('${JSON.stringify(
          req.user,
        )}', '*');window.close();</script>`,
      );
    } catch (err) {
      res.status(500)
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token')
      res.send()
    } catch (e) {
      console.log(e)
      res.status(500).json({message: 'Ошибка при выходе'})
    }
  }

  async login(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
      const whereQuery = {email: email, password: password};
      const findUser = await User.findOne({
        where: whereQuery
      })

      if(!findUser) {
        return res.status(400).json({message: `Пользователь с email: ${email} не найден`})
      }
      const token = createJwtToken(email)
      res.cookie('token', token, {httpOnly: true})
      res.send({message: "вы вошли"})
    } catch (e) {
      res.status(500).json({message: 'Error sending sms(Ошибка при отправке)'})
    }
  }

  async getMe(req, res) {
    const user = req.user
    try {
      if(user) {
        const userInfo = await User.findOne({
          where: {
            email: user.email
          }
        })
        const sendUser = {
          id: userInfo.id,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          avatarUrl: userInfo.avatarUrl,
          isActive: userInfo.isActive,
          aboutMe: userInfo.aboutMe,
        }
        return res.json(sendUser)
      }
    } catch (e) {
      return res.json(e)
    }
  }

  async registration(req, res) {
    try {
      const email = req.body.email
      const findEmail = await User.findOne({
        where: {
          email: email
        }
      })

      if (findEmail) {
        return res.status(409).json({message: `email: ${email} уже используется`});
      }

      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        avatarUrl: req.body.avatarUrl,
        isActive: false,
      }
      const token = createJwtToken(email)
      await User.create(user)
      res.cookie('token', token, {maxAge: 3600 * 24 * 30 * 1000 ,httpOnly: true})
      res.status(201).json(user);
    } catch (e) {
      console.log(e)
    }
  }

  async sendCode(req, res) {
    const email = req.query.email
    try {
      if (!email) {
        return res.status(400).json({
          message: 'email не был указан'
        });
      }
      const code = generateRandomCode()
      const findCode = await Code.findOne({
        where: {
          email: email
        }
      })

      if (findCode) {
        return res.status(400).json({message: 'Код уже был отправлен'});
      }

      await MailService.sendActivateCode(email, code)

      await Code.create({
        code: code,
        email: email,
      });
      return res.status(201).json({message: 'Код успешно отправлен'});

    } catch (error) {
      res.status(500).json({message: 'Error sending sms(Ошибка при отправке)'})
    }
  }

  async activate(req, res) {
    const user = req.user.email
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({message: 'Введите код активации!'});
    }

    const whereQuery = {code: code, email: user};

    try {
      const findCode = await Code.findOne({
        where: whereQuery
      })
      if (findCode) {
        await Code.destroy({
          where: whereQuery
        })
        await User.update({isActive: true}, {where: {email: user}})
        return res.send()
      } else {
        res.status(400).json({
          message: 'Неверный код',
        })
      }

    } catch (e) {
      res.status(500).json({message: 'Ошибка при активации аккаунта'})
    }
  }
}

module.exports = new AuthController()
