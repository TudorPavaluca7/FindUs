const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    
    photo: {
        data: Buffer, //will be stored in a binary data format in the database (image in a binary data format)
        contentType: String //the type of image (pdf, jpg)
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: "User" }
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);
