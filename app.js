const express = require(`express`)
const hbs = require(`hbs`)
const path = require(`path`)
const {getTranscript} = require(`./public/youtube.js`)
const {main} = require(`./public/openai-app.js`)
const { default: OpenAI } = require("openai")
const {writeDocument} = require(`./google.js`)
const fs = require(`fs`)

const app = express()
app.use(express.json()) 

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
    
    if(!req.query.pages || !req.query.title || !req.query.profName || !req.query.usersName || !req.query.className || !req.query.guidelines || !req.query.format || !req.query.date || !req.query.sources) {
            return res.send(`Your request must include the query key-value pairs for the title, professor name, writer name, classname, guidelines, and number of pages`)
        }

    else if(req.query.format === 'MLA') {
        const client = new OpenAI()
        const response = await client.responses.create({
            model: `gpt-4.1`,
            input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${req.query.guidelines}, it must be ${req.query.pages} pages long the professor's name, writer/users name, className, date, format,essay title, and the sources must be included in the response, 
            professor name is ${req.query.profName}, classname is ${req.query.className}, the date is ${req.query.date}, users name is${req.query.usersName}, the format is ${req.query.format} and the title and topic is ${req.query.title}, the links to the sources are ${req.query.sources}, include in text MLA style citations in the body of the essay,  
            please return the essay in JSON format where the title, professorName, usersName, className, and format are properties on the object and so is the essays intro, body, and conclusion, lastly, create a citations property in the response which is an array of MLA citations using the sources provided in the request, all are props on the JSON object, we want the JSON to be immediately parsable not wrapped up in strings`,
        })
    
        const essayJSON = response.output_text
        //log just for testing to know when response is done i can check dev console
        fs.writeFileSync(`generated-essay.json`, essayJSON)
        res.send(essayJSON)
    }
    
    else if (req.query.format === 'APA') {
        const client = new OpenAI()
        const response = await client.responses.create({
            model: `gpt-4.1`,
            input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${req.query.guidelines}, it must be ${req.query.pages} pages long. The format is ${req.query.format} format. In your response please return a JSON object with the properties title, abstract, introduction, and format. For the rest of the properties, they'll be the names of 
            the next sections, so add more properties called section1, section2..., the amount of sections will be based on the amount of pages. The values of the properties will be the text for it, so the abstract property will contain the abstract, the introduction will contain the intro, and so on. The last property will be the conclusion
            we want the JSON to be immediately parsable not wrapped up in strings`,
        })
    
        const essayJSON = response.output_text
        res.send(essayJSON)
        fs.writeFileSync(`generated-essay.json`, essayJSON)
    }
})


app.post('/write-doc', async (req, res) => {
  // run heavy / risky work AFTER response
    try {
        await writeDocument('122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0')
        res.json({success:true})
        console.log('✅ writeDocument finished');
    } catch (err) {
        console.log('❌ writeDocument crashed:', err);
    }

});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
