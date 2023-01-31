import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

// Database
import database from './database/db.js'

// Routes
import pageRoute from './routes/pageRoute.js'
import photoRoute from './routes/photoRoute.js'
import userRoute from './routes/userRoute.js'

// Middleware
import { checkUser } from './middlewares/auth.js'

dotenv.config()
database()

const app = express()


// Template Engine
app.set('view engine', 'ejs')

// Middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('*', checkUser)
app.use('/', pageRoute)
app.use('/photos', photoRoute)
app.use('/users', userRoute)


app.listen(process.env.PORT, () => {
    console.log('Serving on port ' + process.env.PORT)
})