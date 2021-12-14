const Router = require('express').Router
const AuthController = require("../Controllers/AuthController");
const passport = require("../core/passport");

const router = new Router()

router.post('/registrations',AuthController.registration)

router.get('/code', AuthController.sendCode)

router.get('/code/activate', passport.authenticate('jwt',{ session: false }), AuthController.activate)

router.post('/login', AuthController.login)

router.get('/logout', AuthController.logout)

router.get('/me', passport.authenticate('jwt',{ session: false }), AuthController.getMe)

//passport.authenticate('jwt',{ session: false })

module.exports = router