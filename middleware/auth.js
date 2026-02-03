const jwt = require(`jsonwebtoken`)
const User = require(`../models/user`)

async function auth(req, res, next) {
    try {
        const token = req.header('Authorization').replace(`Bearer `, ``)
        /*how vefify works: 
        Splits the token into parts
        
        Takes the data part
        
        Takes your secret
        
        Re-runs the same math used in sign()
        
        Compares the result to the token’s signature
        
        If they match → ✅ valid
        
        If not → ❌ invalid (fake or altered) */
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
    
        req.token = token
        req.user = user
        next()

    } catch(err) {
        res.status(401).send({error: 'Please authenticate'})
    }

}
module.exports = auth