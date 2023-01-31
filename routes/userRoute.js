import express from 'express'
import * as userController from '../controllers/userController.js'

const router = express.Router()

router.route('/dashboard').get(userController.getDashboard)
router.route('/register').post(userController.createUser)
router.route('/login').post(userController.loginUser)
router.route('/').get(userController.getAllUsers)
router.route('/:id').get(userController.getAUser)

export default router