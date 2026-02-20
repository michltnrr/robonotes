const jwt = require('jsonwebtoken')
const User = require('../models/user')

async function pageAuth(req, res, next) {
    try {
        const token = req.cookies.auth_token

        if(!token) {
            return next()
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if(!user) {
            return next()
        }

        req.user = user
        req.locals.user = user //makes {{user}} avaialbe in hbs
        next()
    } catch(err) {
        next()
    }
}

module.exports = pageAuth