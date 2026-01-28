const mongoose = require(`mongoose`)
const validator = require(`validator`)
// const Course = require('./course')

const userSchema = new mongoose.Schema({
    userName: {
        type: String, 
        required: true,
        trim: true
    }, 
    
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("The given email is not a valid email")
            }
        }
     },

    password: {
        type: String, 
        required: true,
        trim: true,
        minLength: 8,
        validator(value) {
            if(value === userName || value.includes(userName)) {
                throw new Error("password can not equal or include your username")
            }
        }
    }

})


/*this means, using this object's (User) _id property, search the Course model and find all courses whos owners's
prop value is equal to the _id of this user*/
userSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User', userSchema)
module.exports = User