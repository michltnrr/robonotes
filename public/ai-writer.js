const generateButton = document.querySelector(`#essay-link`)

async function fetchEssayData(e) {
    e.preventDefault()
    
    const pages = document.querySelector(`#num-pages`).value
    const essayTitle = document.querySelector(`#title`).value
    const profName = document.querySelector(`#professor`).value
    const usersName = document.querySelector(`#users-fullname`).value
    const className = document.querySelector(`#classname`).value
    const guidelines = document.querySelector(`#guidelines`).value
    
    const url = `/writer/assistant?pages=${encodeURIComponent(pages)}&title=${encodeURIComponent(essayTitle)}&profName=${encodeURIComponent(profName)}&usersName=${encodeURIComponent(usersName)}&className=${encodeURIComponent(className)}&guidelines=${encodeURIComponent(guidelines)}`
    const essayFetch = await fetch(url)
    const essayData = await essayFetch.json()
    console.log(essayData) 
    
}

generateButton.addEventListener(`click`, fetchEssayData)