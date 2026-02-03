const mongoose = require(`mongoose`)
const validator = require(`validator`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

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
                throw new Error("password can not be equal to or include your username")
            }
        }
    },

    tokens: [
        {
            token: {
                type: String, 
                required: true
            }
        }
    ]
}, {timestamps: true})


/*this means, using this object's (User) _id property, search the Course model and find all courses whos owners's
prop value is equal to the _id of this user*/
userSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function () {
    const user = this
    /*why do we need isModified in a pre('save')? because If the document is brand new, all fields are considered “modified” automatically
     → isModified('password') returns true*/
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()
    
    delete userObj.password
    delete userObj.tokens

    return userObj
}

userSchema.statics.findbyCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error("No user found with given credentials")
    }
    console.log(`password: ${password}\nuser password: ${user.password}`)
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error("Incorrect password")
    }

    return user
}

const User = mongoose.model('User', userSchema)
module.exports = User