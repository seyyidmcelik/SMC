import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Photo from "../models/photoModel.js"
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer'
import emailTemplate from '../util/emailTemplate.js'

const createUser = async (req, res) => {
    try {
        const user = await User.create(
            {
                username: req.body.username,
                description: '',
                email: req.body.email,
                password: req.body.password
            }
        )
        res.status(201).json({ user })
    } catch (error) {
        let _errors = {}

        if (error.code === 11000) {
            _errors.email = 'The email is already registered'
        }

        if (error.name === 'ValidationError') {
            Object.keys(error.errors).forEach((key) => {
                _errors[key] = error.errors[key].message
            })
        }

        res.status(400).json(_errors)
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

const getAUser = async (req, res) => {
    try {
        if (req.params.id === res.locals.user._id.toString()) {
            res.status(301).redirect('/users/dashboard')
        } else {
            const selectedUser = await User.findById({ _id: req.params.id })
            const photos = await Photo.find({ owner: selectedUser._id, isProfilePhoto: false })
            const profilePhoto = await Photo.findOne({ owner: req.params.id, isProfilePhoto: true })
            const inFollowers = selectedUser.followers.some((follower) => {
                return follower.equals(res.locals.user._id)
            })
            res.status(200).render('user', {
                selectedUser,
                photos,
                inFollowers,
                profilePhoto,
                link: ''
            })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

const getDashboard = async (req, res) => {
    const user = await User.findOne({ _id: res.locals.user._id }, 'username followers followings description')
    const photos = await Photo.find({ owner: res.locals.user._id, isProfilePhoto: false }).sort({ createdAt: -1 }).populate('owner', 'username')
    const profilePhoto = await Photo.findOne({ owner: res.locals.user._id, isProfilePhoto: true })
    res.render('dashboard', {
        link: 'dashboard',
        user,
        photos,
        profilePhoto
    })
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        const to = req.cookies.to
        let same = false
        if (user) {
            same = await bcrypt.compare(password, user.password)
        } else {
            return res.status(401).json({ emailError: 'There is no such user' })
        }
        if (same) {
            const token = createToken(user._id)
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 3
            })
            res.status(200).json({
                user,
                to
            })
        } else {
            res.status(401).json({
                passwordError: 'Passwords do not match'
            })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

const follow = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { followers: res.locals.user._id } },
            { new: true }
        )
        await User.findByIdAndUpdate(
            { _id: res.locals.user._id },
            { $push: { followings: req.params.id } },
            { new: true }
        )
        res.status(200).redirect(`/users/${req.params.id}`)
    } catch (error) {
        res.status(500).json({ error })
    }
}

const unfollow = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $pull: { followers: res.locals.user._id } },
            { new: true }
        )
        await User.findByIdAndUpdate(
            { _id: res.locals.user._id },
            { $pull: { followings: req.params.id } },
            { new: true }
        )
        res.status(200).redirect(`/users/${req.params.id}`)
    } catch (error) {
        res.status(500).json({ error })
    }
}

const updateDescription = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            { _id: res.locals.user._id },
            { $set: { description: req.body.description.trim() } },
            { new: true }
        )
        res.status(200).redirect('/users/dashboard')
    } catch (error) {
        res.status(500).json({ error })
    }
}

const updatePassword = async (req, res) => {
    try {
        let { currentpass, newpass } = req.body

        const user = await User.findById({ _id: res.locals.user._id })

        let isMatch = await bcrypt.compare(currentpass, user.password)

        if (isMatch) {
            user.password = newpass
            await user.save()
            res.status(200).json({ success: true, message: 'Password has updated' })
        } else {
            res.status(400).json({ success: false, message: 'Password is not correct' })
        }


    } catch (error) {
        res.status(500).json({ error })
    }
}

const deleteAccount = async (req, res) => {
    try {
        await User.updateMany(
            { _id: { $ne: res.locals.user._id } },
            { $pull: { followers: res.locals.user._id, followings: res.locals.user._id } },
            { new: true }
        )
        await User.updateMany(
            { _id: res.locals.user._id },
            { $pull: { followings: { $ne: res.locals.user._id }, followers: { $ne: res.locals.user._id } } },
            { new: true }
        )
        const photos = await Photo.find({ owner: res.locals.user._id })
        photos.forEach(async (photo) => {
            await cloudinary.uploader.destroy(photo.image_id)
        })
        await Photo.deleteMany({ owner: res.locals.user._id })
        await User.deleteOne({ _id: res.locals.user._id })
        res.cookie('jwt', '', {
            maxAge: 1
        })
        res.cookie('to', '', {
            maxAge: 1
        })
        res.status(200).redirect('/')
    } catch (error) {
        res.status(500).json({ error })
    }
}

const resetPasswordWithEmail = async (req, res) => {
    let { email } = req.body

    const user = await User.findOne({ email })

    if (!user) return res.status(403).json({ success: false, message: 'There is no such user' })

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODE_MAIL,
                pass: process.env.NODE_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.NODE_MAIL,
            to: email,
            subject: "Password Reset",
            html: emailTemplate({ brand: 'SMC', username: user.username, passUrl: process.env.RESET_URL, id: user._id }),
        });

        res.status(200).json({ success: true, message: 'Check your email to reset password' })
    } catch (error) {
        res.status(500).json({ error })
    }
}

const getResetPassword = (req, res) => {
    res.render('resetpassword', {
        link: 'resetpassword'
    })
}

const postResetPassword = async (req, res) => {
    const { _id, newpass } = req.body
    try {
        const user = await User.findById({ _id })
        user.password = newpass
        await user.save()
        res.status(200).json({ success: true, message: 'Password has reset' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

export {
    createUser,
    getAllUsers,
    getAUser,
    loginUser,
    getDashboard,
    follow,
    unfollow,
    updateDescription,
    updatePassword,
    deleteAccount,
    getResetPassword,
    resetPasswordWithEmail,
    postResetPassword
}