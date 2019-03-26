const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MomentSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    imgs:{
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Moment = mongoose.model('moments', MomentSchema)