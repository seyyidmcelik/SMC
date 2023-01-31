import mongoose from "mongoose";

const db = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.DB_URI, {
        dbName: 'SMC',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to database')
    }).catch((err) => {
        console.error(err)
    })
}

export default db