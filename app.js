const express = require(`express`)
const hbs = require(`hbs`)
const path = require(`path`)
const getTranscript = require(`./public/youtube.js`)

const app = express()

const viewsPath = path.join(__dirname, `/views`)
const partialsPath = path.join(__dirname, `/views/partials`)
const publicPath = path.join(__dirname, '/public')
// console.log(__dirname)
// console.log(viewsPath)
// console.log(partialsPath)

app.use(express.static(publicPath))
app.set(`view engine`, `hbs`)
app.set(`views`, viewsPath)
hbs.registerPartials(partialsPath)


app.get(`/`, (req, res) => {
    res.render(`index`, {
        name: `Mike Turner`
    })
})

app.get(`/summary`, async (req, res) => {
    if(!req.query.url) {
        return res.send(`Please provide a url for the video`)
    }

    const trasncript = await getTranscript(req.query.url)


    res.render(`summary`, {
        name: 'Mike Turner'
    })

})

app.listen(4000, () => {
    console.log(`Server is running on port 4000.`)
})