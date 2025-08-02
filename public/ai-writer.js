// const dotenv = require('dotenv')
// const OpenAI = require ('openai');
// import dotenv from 'dotenv'
// import OpenAI from 'openai'
// dotenv.config()

// const pages = 2
// const essayTitle = `African American History`
// const profName = 'James Brown'
// const usersName = `Mike Turner`
// const className = `AFS 1100`
// const guidelines = `Essay must be 2-3 pages long, times new roman, 12 pt font`
const pages = document.querySelector(`#num-pages`).value
const essayTitle = document.querySelector(`#title`).value
const profName = document.querySelector(`#professor`).value
const usersName = document.querySelector(`#users-fullname`).value
const className = document.querySelector(`#classname`).value
const guidelines = document.querySelector(`#guidelines`).value

const generateButton = document.querySelector(`#essay-link`)


/*I THINK I NEED TO HAVE THE SERVER MAKE THE OPEN AI REQUEST, make a JSON endpoint and use fetch to send the data using the dom values, in the server file
the dom values will be replaced as query key val pairs*/
generateButton.addEventListener(`click`, async () => {
        try{
            const essayContents = fetch(`/writer/assistant?pages=${encodeURIComponent(pages)}&title=${encodeURIComponent(essayTitle)}&profName=${encodeURIComponent(profName)}&usersName=${encodeURIComponent(usersName)}&className=${encodeURIComponent(className)}&=guidlines=${encodeURIComponent(guidelines)}`)
            console.log(essayContents)
            
        } catch(err) {
            console.error(err)
        }
})
    
    
//     async function writeEssay() {
//         const client = new OpenAI()
        
//         const response = await client.responses.create({
//             model: 'gpt-4.1',
//             input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${guidelines}, it must be ${pages} pages long
//             the professor's name, writer/users name, className, and essay title must be included in the response, professor name is ${profName}, classname is ${className}, users name is${usersName}, and the title is ${essayTitle}
//             please return the essay in JSON format where the title, professor name, usersName, and className, properties on the object and so is the essays intro, body, and conclusion, all are props on the JSON object`
//         })

//         console.log(response.output_text)
// }
// writeEssay()