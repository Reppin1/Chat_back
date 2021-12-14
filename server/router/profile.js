const Router = require('express');
const ProfileController = require('../Controllers/ProfileController')
const passport = require('../core/passport');

const router = new Router()

router.get('/profile/:id', passport.authenticate('jwt',{ session: false }), ProfileController.getProfile)

module.exports = router