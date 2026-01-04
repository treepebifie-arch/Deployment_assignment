const jwt = require ('jsonwebtoken')
const bcrypt = require ('bcryptjs')
const User = require('../models/user.models');
const sendEmail = require('../config/email');



const signup = async (req, res) => {
    const {name, userName, password, email} = req.body
    try {
        if (!name || !userName || !password || !email) { 
            return res.status(400).json('all fields required')
        };
        
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status (400).json('user already exists')
        };
        const hashedPassword = await bcrypt.hash (password, 10);
        const otp = Math.floor (100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now () + 5 * 60 * 1000)

        const newUser = new User ({
            name,
            email,
            password: hashedPassword,
            userName,
            otp,
            otpExpiry
        });
        await newUser.save()

        // // Send OTP email
        // await sendEmail (
        //     email,
        //     'Account Verification',
        //     `Your otp for account verification is ${otp}`
        // );
        return res.status(201).json({message:'account created successfully', otp})        
    } catch (err) {
        console.error ('account creation failed', err)
        return res.status(500).json ('internal server error')
    }
};

const login = async (req, res) => {
    const {userName, password} = req.body
    try {
        if (!userName ||  !password) {
            return res.status(400).json({message: 'all fields required'})
        };
        const user = await User.findOne({userName})
            if (!user) {
                return res.status(404).json({message: 'user not found'})
            };
        const comparePassword = await bcrypt.compare (password, user.password)
        if (!comparePassword) {
            return res.status(400).json({message: 'invalid credentials'})
        };
        if (!user.isVerified) {
            return res.status(401).json({message: 'account not verified, please verify your account'})
        };
        console.log(user)

        const token = await jwt.sign ({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h',
         });

         const userRole = user.role

        return res.status(200).json({message: 'login successful', token, userRole})
    } catch (err) {
        console.error('login error', err)
        return res.status(500).json('server error')
    }
};

const verifyOtp = async (req, res)  => {
    const {otp} = req.body
    try {
        if (!otp) {
            return res.status(400).json({message: 'otp is required'})
        }
        const user = await User.findOne ({otp})
        if (!user) {
            return res.status(404).json({message:'invalid otp'})
        };
        if (Date.now()>user.otpExpiry){
            return res.status(400).json({message: 'otp has expired'})
        }
        user.isVerified = true,
        user.otp = null,
        user.otpExpiry = null
        await user.save()
        return res.status(200).json({message: 'account verification successful'});        
    } catch (err) {
        console.error('otp verification error', err)
        return res.status(500).json({nessage: 'server error'})
    }
};

const resendOtp = async (req, res) => {
    const {email} = req.body
    try {
        if (!email){
            return res.status(400).json({message: 'email is required'})
        };
        const user = await User.findOne({email})
        if (!user){
            return res.status(404).json({message: 'account not found'})
        };
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date (Date.now() + 5 * 60 * 1000)
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save()

        // await sendEmail (
        //     email,
        //     'OTP Resend',
        //     `Your new otp is ${otp}`
        // );
        return res.status(200).json({message:'Otp resent successfully', otp})
    } catch (err) {
        console.error('Otp resend error', err)
        return res.status(500).json({message: 'server error'})
    };
};


const forgotPassword = async (req, res) =>{
    const {email} = req.body
    try {
        if (!email){
            return res.status(400).json({message: 'email is required'})
        };
        const user = await User.findOne({email})
        if (!user){
            return res.status(404).json({message: 'account not found'})
        };
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date (Date.now() + 5 * 60 * 1000)
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save()

        // await sendEmail (
        //     email,
        //     'Reset Password',
        //     `Your otp for password reset is ${otp}`
        // );
        return res.status(200).json({message:'Otp sent successfully', otp})
    } catch (err) {
        console.error('forgot password error', err)
        return res.status(500).json({message: 'server error'})
    }
};

const resetPassword = async (req, res) => {
    const {otp, newPassword} = req.body
    try {
         if (!otp || !newPassword) {
            return res.status(400).json({message: 'all fields are required'})
        }
        const user = await User.findOne ({otp})
        if (!user) {
            return res.status(404).json({message:'invalid otp'})
        };
        if (Date.now()>user.otpExpiry){
            return res.status(400).json({message: 'otp has expired'})
        }
        const updatedPassword = await bcrypt.hash (newPassword, 10)
        user.password = updatedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save()
        return res.status(200).json({message: 'Password reset successful'})
    } catch (err) {
        console.error('reset password error', err)
        return res.status(500).json({message: 'server error'}) 
    }
};

// Role Based Authorization

const deleteUser = async (req, res) => {
    const {role} = req.user
    try {
        if (role !=='admin'){
            return res.status(403).json({message: 'access denied'})
        };
        const {email} = req.body 
        const user = await User.findOneAndDelete({email})
        if (!user) {
            return res.status(404).json({message: 'Account not found'})
        };
        return res.status(200).json({message: 'Account deleted successfully'})
    } catch (err) {
        console.error('authorization error', err)
        return res.status(500).json({message: 'server error'})
    }
};

const getAllUsers = async (req, res) => {
    const {role} = req.user
    try {
        if (role !=='admin'){
            return res.status(403).json({message: 'access denied'})
        };
        const users = await User.find().select('-otp -otpExpiry -password')
        return res.status(200).json(users)
    } catch (err) {
        console.error('error', err)
        return res.status(500).json({message: 'server error'})
    };
};

const updatedRole = async (req, res) => {
    const {role} = req.user
    try {
        if (role !=='admin'){
            return res.status(403).json({message: 'access denied'})
        };
        const {userId} = req.params
        const updatedUser = await User.findByIdAndUpdate(userId, {role: 'admin'},
            {new: true});
        if (!updatedUser){
            return res.status(400).json({message: 'account not found'})
        }
        return res.status(200).json({message: `${updatedUser.userName} is now an admin`})
    } catch (err) {
        console.error('error', err)
        return res.status(500).json({message: 'server error'})
    };
};


module.exports = {signup, login, verifyOtp, resendOtp, forgotPassword, resetPassword, deleteUser, getAllUsers, updatedRole}