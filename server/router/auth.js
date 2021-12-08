const Router = require('express').Router
const AuthController = require("../Controllers/AuthController");

const router = new Router()

router.post('/registrations',AuthController.registration)

router.get('/code', AuthController.sendCode)

router.get('/code/activate', AuthController.activate)

router.post('/login', AuthController.login)

router.get('/logout', AuthController.logout)

router.get('/me', AuthController.getMe)

module.exports = router