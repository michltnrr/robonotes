const express = require(`express`)
const hbs = require(`hbs`)
const path = require(`path`)
const {getTranscript} = require(`./public/youtube.js`)
const {main} = require(`./public/openai-app.js`)
const { default: OpenAI } = require("openai")
const {writeMLA} = require(`./essay/mla.js`)
const {writeAPA} = require("./essay/apa.js")
const fsPromises = require(`fs`).promises

const ESSAY_JSON_FILE = path.join(__dirname, 'essay', 'generated-essay.json')
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

app.get(`/study`, (req, res) => {
    res.render(`study`, {
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
            input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${req.query.guidelines}, it must be ${req.query.pages} pages long the professor's name, writer/users name, className, date, format,essay title, affiliation, and the sources must be included in the response, 
            professor name is ${req.query.profName}, classname is ${req.query.className}, the date is ${req.query.date}, users name is${req.query.usersName}, the format is ${req.query.format} and the title and topic is ${req.query.title}, the links to the sources are ${req.query.sources}, the affiliation is ${req.query.affiliation}include in text MLA style citations in the body of the essay,  
            please return the essay in JSON format where the title, professorName, usersName, className, and format are properties on the object and so is the essays intro, body, and conclusion, lastly, create a citations property in the response which is an array of MLA citations using the sources provided in the request, all are props on the JSON object, we want the JSON to be immediately parsable not wrapped up in strings`,
        })
    
        const essayJSON = response.output_text
        await fsPromises.writeFile(ESSAY_JSON_FILE, essayJSON)
        res.send(essayJSON)
    }
    
    else if (req.query.format === 'APA') {
        const client = new OpenAI()
        const response = await client.responses.create({
            model: `gpt-4.1`,
            input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${req.query.guidelines}, it must be ${req.query.pages} pages long. The title is ${req.query.title}, the professors name is ${req.query.profName}, the class name is ${req.query.className}, the writers name is ${req.query.usersName}, the date is ${req.query.date}the affiliation is ${req.query.affiliation}
            The format is ${req.query.format} format, ALL OF THESE MUST BE PROPERTIES ON THE JSON OBJECT YOU RETURN, for the title, professor, user, and class, name the properties "title","professorName", "usersName", and "className". For the headings, make it an array of objects, the objects will have the props, title, subheading, and body, please be sure to include the subheadings. For the first object in the headings array, its title will be ${req.query.title}, it doesn't need a subheading property, its body property, will be the introduction.
            Also create a conclusion property which is also and object with the properties title and body. Lastly we need a references property which is an array of strings with APA style references in alphabetical order formatted similar to the following source, dont include this directly, its just an example: "American Psychological Association. (2020). Publication manual of the American Psychological
            Association (7th ed.). https://doi.org/10.1037/0000165-000", pre-formatted based on the source type. The references are ${req.query.sources}, only use these to create the references. Include apa style in text citations in the bodies of the headings, also use a mix of secondary source citations, narrative citations, "for more" citations, et.al citations, and use block quotes when needed.
            we want the JSON to be immediately parsable not wrapped up in strings`,
        })
        
        const essayJSON = response.output_text
        await fsPromises.writeFile(ESSAY_JSON_FILE, essayJSON)
        res.send(essayJSON)
    }
})

app.post('/write-doc', async (req, res) => {
    try {
        if(req.body.format === 'MLA')
            await writeMLA('122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0')
        else 
            await writeAPA('122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0')
        
        res.json({success:true})
        console.log('✅ writeDocument finished');
    } catch (err) {
        console.log('❌ writeDocument crashed:', err);
    }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});