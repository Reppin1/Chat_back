const {User} = require('../../models')
const {Code} = require('../../models')
const generateRandomCode = require('../../utils/generateRandomCode')
const MailService = require('../service/mail-service')
const createJwtToken = require("../../utils/createJwtToken");
const jwt = require("jsonwebtoken");
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

  async getMe(req, res) {
    const token = req.cookies.token
    try {
      if(token) {
        const {user} = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userInfo = await User.findOne({
          where: {
            email: user
          }
        })
        res.json(userInfo)
      }
    } catch (e) {
      console.log(e)
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
      await User.create(user)
      const token = createJwtToken(email)
      res.cookie('token', token, {httpOnly: true})
      res.status(201).json({message: 'данные отправлены в бд'});
    } catch (e) {
      console.log(e)
    }
  }

  async test(req, res) {
    res.json({message: 'Test INFo'})
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
    const {token} = req.cookies
    const {user} = jwt.verify(token, process.env.JWT_SECRET_KEY)
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
