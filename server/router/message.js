const DilogController = require('../Controllers/DialogController')
const Router = require('express').Router

const router = new Router()

router.get('/', DilogController.getDialog)

router.get('/:id')

router.post('/message')