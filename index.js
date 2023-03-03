import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary';
import methodOverride from 'method-override'
import fileUpload from 'express-fileupload';

// Database
import database from './database/db.js'

// Routes
import pageRoute from './routes/pageRoute.js'
import photoRoute from './routes/photoRoute.js'
import userRoute from './routes/userRoute.js'

// Middleware
import { checkUser } from './middlewares/auth.js'

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})
database()

const app = express()


// Template Engine
app.set('view engine', 'ejs')

// Middlewares
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))
app.use(methodOverride('_method', {
    methods: ['GET', 'POST', 'DELETE']
}))

app.use('*', checkUser)
app.use('/', pageRoute)
app.use('/gallery', photoRoute)
app.use('/users', userRoute)


app.listen(process.env.PORT, () => {
    console.log('Serving on port ' + process.env.PORT)
})