const mongoose = require('mongoose');

const LikedVideoSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    videos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
    }]

})

const LikedVideos = new mongoose.model('LikedVideos', LikedVideoSchema);

module.exports = {
    LikedVideos
};