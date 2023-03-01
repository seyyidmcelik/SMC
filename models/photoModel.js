import mongoose from "mongoose";

let { Schema } = mongoose;

const photoSchema = new Schema({
    description: {
        type: String,
    },
    tags: [],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    image_id: {
        type: String,
        required: true
    },
    isProfilePhoto: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo