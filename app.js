const express = require(`express`)
const hbs = require(`hbs`)
const path = require(`path`)
require(`./db/mongoose.js`)
const userRouter = require(`./routers/user`)
const courseRouter = require(`./routers/course`)
const noteRouter = require(`./routers/note`)


const {getTranscript} = require(`./public/youtube.js`)
const {main} = require(`./public/openai-app.js`)
const { default: OpenAI } = require(`openai`)
const spawn = require(`child_process`).spawn

const {writeMLA} = require(`./essay/mla.js`)
const {writeAPA} = require(`./essay/apa.js`)
const {createQuiz} = require(`./public/quiz.js`)
const {prepVideo, getsceneName} = require(`./public/video.js`)
const fsPromises = require(`fs`).promises

const ESSAY_JSON_FILE = path.join(__dirname, 'essay', 'generated-essay.json')
const app = express()
app.use(express.json()) 
app.use('/media', express.static(path.join(__dirname, 'media')));


const viewsPath = path.join(__dirname, `/views`)
const partialsPath = path.join(__dirname, `/views/partials`)
const publicPath = path.join(__dirname, '/public')

app.use(express.static(publicPath))
app.use(userRouter)
app.use(courseRouter)
app.use(noteRouter)


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


app.get(`/study`, (req, res) => {
    res.render(`study`, {
        name: `Mike Turner`
    })
})

app.post(`/study/generate`, async (req, res) => {
    const {mode, prompt} = req.body

    if(!mode || !prompt) {
        return res.status(400).json({error: "Missing mode or prompt"})
    }
    try {
        if(mode === 'quiz') {
            const quizJSON = await createQuiz(prompt)
            return res.json({data: quizJSON})
        }

        if(mode === 'video') {
            const videoCode = await prepVideo(prompt)
            
            let patchedCode = videoCode
                // 1. Fix double/triple .animate chaining
                .replace(/\.animate((?:\.[a-zA-Z_]+\([^)]*\))+)\.animate/g, '.animate$1')
                
                // 2. Fix trailing .animate with no methods
                .replace(/(\w+)\.animate\.animate\b/g, '$1.animate')
                
                // 3. Fix method().animate pattern (should be animate.method())
                .replace(/(\w+)\.((?:shift|scale|rotate|move_to|next_to|to_edge|to_corner|set_color|set_opacity)\([^)]*\))\.animate/g, '$1.animate.$2')
                
                // 4. Fix Brace.get_text / get_tex
                .replace(/Brace\.get_(text|tex)\(([^)]*?)\)/g, (match, braceType, braceArgs) => {
                    return `Brace.get_${braceType}(${braceArgs.replace(/,\s*font_size\s*=\s*\d+/, '')})`;
                })
                
                // 5. Fix SurroundingRectangle unsafe indexing
                .replace(/SurroundingRectangle\(([^)\[\]]+)\[\d+\](.*?)\)/g, 'SurroundingRectangle($1$2)');

            const manimfilePath = path.join(__dirname, 'video_scene.py')
            await fsPromises.writeFile(manimfilePath, patchedCode, 'utf8')

            const sceneName = getsceneName(videoCode)
            console.log(sceneName)

            const mainmProcess = spawn(`python3`, [`-m`, `manim`, manimfilePath, sceneName, `-qh`])

            let output = '';
            mainmProcess.stdout.on('data', data => {output += data.toString();});
            mainmProcess.stderr.on('data', data => {output += data.toString();});


            await new Promise((resolve, reject) => {
                mainmProcess.on('close', code => {
                    if (code !== 0) {
                        console.error(output)
                        reject(new Error(output))
                    }
                    else {
                        resolve();
                    }
                });
            });
            // 5️⃣ Return video path
            const videoPath = `/media/videos/video_scene/1080p60/${sceneName}.mp4`;
            console.log(videoPath)

            return res.json({ videoPath });
        }

        if(mode === 'summary') {
            const videoID = prompt.slice(prompt.indexOf(`=`)+1)
            const transcript = await getTranscript(videoID)
            const response = await main(transcript)

            return res.json({response})
    
        }

        return res.json({
            data: "Generated content here"
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            error: "Failed to generate content"
        })
    }
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