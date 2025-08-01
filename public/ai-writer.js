// const dotenv = require('dotenv')
// const OpenAI = require ('openai');
import dotenv from 'dotenv'
import OpenAI from 'openai'
dotenv.config()

// const pages = 2
// const essayTitle = `African American History`
// const profName = 'James Brown'
// const usersName = `Mike Turner`
// const className = `AFS 1100`
// const guidelines = `Essay must be 2-3 pages long, times new roman, 12 pt font`
const pages = document.querySelector(`#num-pages`).value
const essayTitle = document.querySelector(`#essay-title`).value
const profName = document.querySelector(`#professor`).value
const usersName = document.querySelector(`#users-fullname`).value
const className = document.querySelector(`#classname`).value
const guidelines = document.querySelector(`#guidelines`).value

const generateButton = document.querySelector(`#essay-link`)


/*I THINK I NEED TO HAVE THE SERVER MAKE THE OPEN AI REQUEST, make a JSON endpoint and use fetch to send the data using the dom values*/
generateButton.addEventListener(`click`, async () => {
    const client = new OpenAI()
    
    const response = await client.responses.create({
        model: 'gpt-4.1',
        input: `Your an essay writer, you need to write a college level essay. The guidelines are as follows: ${guidelines}, it must be ${pages} pages long
        the professor's name, writer/users name, className, and essay title must be included in the response, professor name is ${profName}, classname is ${className}, users name is${usersName}, and the title is ${essayTitle}
        please return the essay in JSON format where the pages, title, professor name, usersName, className, and guidliness are properties on the object and so is the essays intro, body, and conclusion, all are props on the JSON object`
    })
    
        console.log(response.output_text)
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