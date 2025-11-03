const generateButton = document.querySelector(`#essay-link`)
const mla = document.querySelector(`#mla-format`)
const apa = document.querySelector(`#apa-format`)
const disclaimer = document.querySelector(`#disclaimer`)

const addSource = document.querySelector(`#add-source`)
const sourcesContainer = document.querySelector(`#sources-container`)

let format
let essayDone = false

function specifyFormat() {
    if(mla.checked === true) {
        format = 'MLA'
        disclaimer.hidden = false
    } else if (apa.checked === true) {
        format = 'APA'
        disclaimer.hidden = false
    }
    return format
}
mla.addEventListener('change', specifyFormat)
apa.addEventListener('change', specifyFormat)

addSource.addEventListener(`click`, (e) => {
    e.preventDefault()
    const inputlink = document.createElement("input")
    inputlink.type = "URL"
    inputlink.placeholder = "Link to article"
    inputlink.className = "source-inputs"
    
    sourcesContainer.appendChild(inputlink)
})

async function fetchEssayData(e) {
    e.preventDefault()
    if(!essayDone) {
    generateButton.disabled = true
    generateButton.style.opacity = 0.5
    generateButton.textContent = `Generating...`
    
    
    const pages = document.querySelector(`#num-pages`).value
    const essayTitle = document.querySelector(`#title`).value
    const date = document.querySelector(`#paper-date`).value
    const profName = document.querySelector(`#professor`).value
    const usersName = document.querySelector(`#users-fullname`).value
    const className = document.querySelector(`#classname`).value
    const guidelines = document.querySelector(`#guidelines`).value
    
    const sourceLinks = document.getElementsByClassName(`source-inputs`)
    const linkURLS = Array.from(sourceLinks).map(input => input.value).filter(link => link.trim() !== "")
    
    const essayFormat = specifyFormat()
    console.log(essayFormat)
    
    // const url = `/writer/assistant?pages=${encodeURIComponent(pages)}&title=${encodeURIComponent(essayTitle)}&profName=${encodeURIComponent(profName)}&usersName=${encodeURIComponent(usersName)}&className=${encodeURIComponent(className)}&guidelines=${encodeURIComponent(guidelines)}&format=${encodeURIComponent(essayFormat)}&date=${encodeURIComponent(date)}`
    const url = `/writer/assistant?` + new URLSearchParams({
        pages,
        title: essayTitle,
        profName,
        usersName,
        className,
        guidelines,
        format: essayFormat,
        date,
        sources: JSON.stringify(linkURLS) 
    }).toString();
    
    const essayFetch = await fetch(url)
    const essayData = await essayFetch.json()
    console.log(essayData) 
    
    const writeResponse = await fetch("/write-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    
    
    const writeResult = await writeResponse.json();
    if (!writeResult.success) throw new Error(writeResult.error);
    
    essayDone = true;
    generateButton.disabled = false
    generateButton.style.opacity = 1.0
    generateButton.textContent = `View Essay`
}
    window.open(`https://docs.google.com/document/d/122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0/edit?tab=t.0`, `_blank`)
}
generateButton.addEventListener(`click`, fetchEssayData)