const express = require ('express')
const { signup, login, verifyOtp, resendOtp, forgotPassword, resetPassword, deleteUser, getAllUsers, updatedRole } = require('../controller/user.controller')
const isAuth = require('../config/auth')
const router = express.Router()




router.post('/signup', signup)
router.post('/login', login)
router.put('/verify-otp', verifyOtp)
router.put('/resend-otp', resendOtp)
router.put('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)
router.delete('/delete-user', isAuth, deleteUser)
router.get('/get-all-users', isAuth, getAllUsers)
router.patch('/make-admin/:userId', isAuth, updatedRole)






module.exports = router;