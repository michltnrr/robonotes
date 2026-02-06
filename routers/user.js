const express = require(`express`)
const User = require(`../models/user`)
const Course = require(`../models/course`)
const Note = require(`../models/note`)
const auth = require(`../middleware/auth`)
const router = new express.Router()

//sign up
router.post(`/users`, async(req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        console.log(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(err) {
        console.log(`save error: ${err}`)
        res.status(400).send()
    }
})

//login
router.post(`/users/login`, async (req, res) => {
    try {
        //recall findbyCredentials is a static method, so here we operate directly on the User model itslef, not an instace of it
        const user = await User.findbyCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    }catch(err) {
        console.log(`${err}`)
        res.status(400).send()
    }
})

//logout user
router.post(`/users/logout`, auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch(err) {
        res.status(500).send()
    }
})

//logout of all sessions
router.post(`/users/logoutall`, auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(err) {
        res.status(500).send()
    }
})

//read profile
router.get(`/users/me`, auth, async (req, res) => {
    try {
        /* remember req.user is created in the auth file, the middleware lets us add custom props to req*/
        const user = req.user
        
        if(!user) {
            throw new Error("User doesn't exist")
        }
        
        res.status(201).send({user})
    } catch(err) {
        res.status(400).send(`Error: ${err}`)
    }
})

//delete user/account
router.delete(`/users/me`, auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        
            if(!user) {
                throw new Error("User doesn't exist")
            }
            await Course.deleteMany({owner: req.user._id})
            await Note.deleteMany({})
            res.status(200).send({user})

    }catch(err) {
        res.status(404).send()
        console.log(err)
    }
})
module.exports = router