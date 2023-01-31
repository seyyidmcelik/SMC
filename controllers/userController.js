import User from "../model/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
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
        const user = await User.find({ _id: req.params.id })
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ error })
    }
}

const getDashboard = async (req, res) => {
    res.render('dashboard', {
        link: 'dashboard'
    })
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
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
                maxAge: 1000 * 60 * 60 * 24
            })
            res.status(200).json(user)
        } else {
            res.status(401).json({
                passwordError: 'Passwords do not match'
            })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1d' })
}

export { createUser, getAllUsers, getAUser, loginUser, getDashboard }