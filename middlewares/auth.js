import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                const user = await User.findById(decodedToken.userId)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

const authenticateToken = async (req, res, next) => {
    try {
        const token = await req.cookies.jwt
        res.cookie('to', req.params.id ? req.params.id : null, {
            httpOnly: true,
            maxAge: 1000 * 30
        })
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, (err) => {
                if (err) {
                    console.log(err.message)
                    res.redirect('/login')
                } else {
                    next()
                }
            })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        res.status(401).json({
            error: 'Not authorized'
        })
    }
}

export { checkUser, authenticateToken }