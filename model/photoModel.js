import mongoose from "mongoose";

let { Schema } = mongoose;

const photoSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo