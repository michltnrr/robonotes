const mongoose = require(`mongoose`)

const courseSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true,
    },
    
    subject: {
        type: String, 
        required: true, 
        trim: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

courseSchema.virtual('notes', {
    ref: 'Note',
    localField:'_id',
    foreignField: 'course'
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course