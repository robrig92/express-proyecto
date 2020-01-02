const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports.Image = Image;