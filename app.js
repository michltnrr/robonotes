const express = require(`express`)
const hbs = require(`hbs`)
const path = require(`path`)
const {getTranscript} = require(`./public/youtube.js`)
const {main} = require(`./public/openai-app.js`)
const { default: OpenAI } = require("openai")

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

app.get(`/summary`, (req, res) => {
    res.render(`summary`, {
        name: 'Mike Turner'
    })

})

//route for api summaries
app.get(`/api/summary`, async (req, res) => {
    if(!req.query.url) {
        return res.send(`Please provide a url for the video`)
    }

    const videoID = req.query.url.slice(req.query.url.indexOf(`=`)+1)
    const transcript = await getTranscript(videoID)
    const response = await main(transcript)
    
    res.send({
        summarization: response,
        name: `Mike Turner`
    })
})

app.get(`/assistant`, (req, res) => {
    res.render(`assistant`, {
        name: `Mike Turner`
    })
})

app.get(`/writer/assistant`, async (req, res) => {
    
    if(!req.query.pages || !req.query.title || !req.query.profName || !req.query.usersName || !req.query.className || !req.query.guidelines) {
            return res.send(`Your request must include the query key-value pairs for the title, professor name, writer name, classname, guidelines, and number of pages`)
        }

        const client = new OpenAI()
        const response = await client.responses.create({
            model: `gpt-4.1`,
            input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${req.query.guidelines}, it must be ${req.query.pages} pages long
        the professor's name, writer/users name, className, and essay title must be included in the response, professor name is ${req.query.profName}, classname is ${req.query.className}, users name is${req.query.usersName}, and the title is ${req.query.essayTitle}
        please return the essay in JSON format where the title, professor name, usersName, and className are properties on the object and so is the essays intro, body, and conclusion, all are props on the JSON object`,
        })
    
        const essayJSON = response.output_text
        res.send(essayJSON)
})

app.listen(4000, () => {
    console.log(`Server is running on port 4000.`)
})