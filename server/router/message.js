const MessageController = require('../Controllers/MessageController')
const passport = require("../core/passport");
const Router = require('express').Router


const router = new Router()

router.post('/message', passport.authenticate('jwt', { session: false }), MessageController.createMessage)

router.get('/message', passport.authenticate('jwt', { session: false }), MessageController.getMessages)

module.exports = router