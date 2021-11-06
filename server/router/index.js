const Router = require('express').Router
const passport = require('../core/passport')
const AuthController = require("../Controllers/AuthController");

const router = new Router()

router.post('/registrations',AuthController.registration)

router.get('/code', AuthController.sendCode)

router.get('/code/activate', AuthController.activate)

router.get('/me', AuthController.getMe)

router.get('/test', passport.authenticate('jwt', {session: false}), AuthController.test)

module.exports = router