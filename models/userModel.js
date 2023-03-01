import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Name is required"]
    },
    description: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Email is not valid"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
})

userSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        user.password = hash
        next()
    })
})

const User = mongoose.model('User', userSchema)

export default User