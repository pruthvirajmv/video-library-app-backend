const mongoose = require('mongoose');
require('mongoose-type-url');

const videoSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: "Video is must"
    },
    name: {
        type: String,
        required: "Video name is required",
        unique: true
    },

    views: {
        type: Number,
        required: "Video views"
    },

    level: {
        type: String,
        required: "Video level must be specified",
    },

    image: {
        type: mongoose.SchemaTypes.Url,
        required: "Please enter Video image url"
    },

    avatar: {
        type: mongoose.SchemaTypes.Url,
        required: "Please enter Video image url"
    },

    channelName: {
        type: String,
        required: "Please enter the channel name"
    }

}, {
    timestamps: true
});

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };