const DialogController = require('../Controllers/DialogController')
const passport = require("../core/passport");
const Router = require('express').Router

const router = new Router()

router.post('/dialog',passport.authenticate('jwt',{ session: false }), DialogController.createDialog)

router.get('/dialog/:id',)

router.get('/dialog', passport.authenticate('jwt',{ session: false }), DialogController.getDialog)

module.exports = router