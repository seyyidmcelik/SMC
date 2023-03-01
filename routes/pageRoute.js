import express from 'express'
import * as pageControls from '../controllers/pageController.js'

const router = express.Router()

router.route('/').get(pageControls.indexPage)
router.route('/login').get(pageControls.login)
router.route('/logout').get(pageControls.logout)
router.route('/register').get(pageControls.register)

export default router