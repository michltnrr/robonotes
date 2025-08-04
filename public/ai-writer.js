const generateButton = document.querySelector(`#essay-link`)
const dateItems = document.querySelector(`.date-items`)
const mla = document.querySelector(`#mla-format`)
const apa = document.querySelector(`#apa-format`)

let format, date;

//I NEED TO DECIDE IF I WANT DATE TO BE APART OF THE FETCH BY DEFAULT OR CONDITIONALLY
function specifyFormat() {
    if(mla.checked === true) {
        format = 'MLA'
        dateItems.hidden = false
        const creationDate = document.querySelector(`#paper-date`).value
    } else if (apa.checked === true) {
        format = 'APA'
        dateItems.hidden = true
    }

    return format

}
mla.addEventListener('change', specifyFormat)
apa.addEventListener('change', specifyFormat)

async function fetchEssayData(e) {
    e.preventDefault()
    
    const pages = document.querySelector(`#num-pages`).value
    const essayTitle = document.querySelector(`#title`).value
    const profName = document.querySelector(`#professor`).value
    const usersName = document.querySelector(`#users-fullname`).value
    const className = document.querySelector(`#classname`).value
    const guidelines = document.querySelector(`#guidelines`).value

    const essayFormat = specifyFormat()
    console.log(essayFormat)

    
    const url = `/writer/assistant?pages=${encodeURIComponent(pages)}&title=${encodeURIComponent(essayTitle)}&profName=${encodeURIComponent(profName)}&usersName=${encodeURIComponent(usersName)}&className=${encodeURIComponent(className)}&guidelines=${encodeURIComponent(guidelines)}`
    const essayFetch = await fetch(url)
    const essayData = await essayFetch.json()
    console.log(essayData) 
    
}
generateButton.addEventListener(`click`, fetchEssayData)