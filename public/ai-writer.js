const generateButton = document.querySelector(`#essay-link`)
const mla = document.querySelector(`#mla-format`)
const apa = document.querySelector(`#apa-format`)

let format

function specifyFormat() {
    if(mla.checked === true) {
        format = 'MLA'
    } else if (apa.checked === true) {
        format = 'APA'
    }
    return format
}
mla.addEventListener('change', specifyFormat)
apa.addEventListener('change', specifyFormat)

async function fetchEssayData(e) {
    e.preventDefault()
    
    const pages = document.querySelector(`#num-pages`).value
    const essayTitle = document.querySelector(`#title`).value
    const date = document.querySelector(`#paper-date`).value
    const profName = document.querySelector(`#professor`).value
    const usersName = document.querySelector(`#users-fullname`).value
    const className = document.querySelector(`#classname`).value
    const guidelines = document.querySelector(`#guidelines`).value

    const essayFormat = specifyFormat()
    console.log(essayFormat)

    
    const url = `/writer/assistant?pages=${encodeURIComponent(pages)}&title=${encodeURIComponent(essayTitle)}&profName=${encodeURIComponent(profName)}&usersName=${encodeURIComponent(usersName)}&className=${encodeURIComponent(className)}&guidelines=${encodeURIComponent(guidelines)}&format=${encodeURIComponent(essayFormat)}&date=${encodeURIComponent(date)}`
    const essayFetch = await fetch(url)
    const essayData = await essayFetch.json()
    console.log(essayData) 
    
}
generateButton.addEventListener(`click`, fetchEssayData)