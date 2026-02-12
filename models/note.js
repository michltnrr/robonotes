const mongoose = require(`mongoose`)

const noteSchema = new mongoose.Schema({
    
    noteType: {
        type: String, 
        required: true
    }, 

    prompt: {
        type: String,
        required: true,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },

    metadata: {
       type: mongoose.Schema.Types.Mixed,
       default: {}
    }
    
}, {timestamps: true})

const Note = mongoose.model('Note', noteSchema)
module.exports = Note