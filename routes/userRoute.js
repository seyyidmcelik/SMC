import express from 'express'
import * as userController from '../controllers/userController.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.route('/').get(userController.getAllUsers)
router.route('/dashboard').get(auth.authenticateToken, userController.getDashboard)
router.route('/dashboard/desc').post(auth.authenticateToken, userController.updateDescription)
router.route('/dashboard/pass').post(auth.authenticateToken, userController.updatePassword)
router.route('/dashboard/del').delete(auth.authenticateToken, userController.deleteAccount)
router.route('/:id').get(auth.authenticateToken, userController.getAUser)
router.route('/:id/follow').put(auth.authenticateToken, userController.follow)
router.route('/:id/unfollow').put(auth.authenticateToken, userController.unfollow)
router.route('/register').post(userController.createUser)
router.route('/login').post(userController.loginUser)
router.route('/resetpassword/:id').get(userController.getResetPassword)
router.route('/resetpassword').post(userController.postResetPassword)
router.route('/resetpasswordemail').post(userController.resetPasswordWithEmail)


export default router