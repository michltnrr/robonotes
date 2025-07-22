const express = require(`express`)
const hbs = require(`hbs`)
const path = require(`path`)
const {getTranscript} = require(`./public/youtube.js`)
const {main} = require(`./public/openai-app.js`)

const app = express()

const viewsPath = path.join(__dirname, `/views`)
const partialsPath = path.join(__dirname, `/views/partials`)
const publicPath = path.join(__dirname, '/public')

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

    console.log(req.query.url)
    const videoID = req.query.url.slice(req.query.url.indexOf(`=`)+1)
    console.log(videoID)
    
    const transcript = await getTranscript(videoID)
    // console.log(transcript)
    const response = await main(transcript)
    // console.log(response)
    
    res.send({
        summarization: response,
        name: `Mike Turner`
    })


    // res.render(`summary`, {
    //     name: 'Mike Turner'
    // })

})

app.listen(4000, () => {
    console.log(`Server is running on port 4000.`)
})