const mongoose = require('mongoose')
const User = require(`../models/user`)

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/robonotes-api')
    try {
        console.log("Connected to robonotes db")
    } catch(err) {
        console.error(`Error: ${err.message}`)
    }
}
main()