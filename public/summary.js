const url = document.querySelector(`.vidLink`)
const textarea = document.querySelector(`#generatedContent`)
const button = document.querySelector(`.generator`)

const copyButton = document.querySelector(`#clipboard`)
const clearButton = document.querySelector(`#clear`)

function copyClipboard() {
    textarea.select();
    textarea.setSelectionRange(0, 999999)
    
    navigator.clipboard.writeText(textarea.value)
}

function clearInputs() {
    url.value = ''
    textarea.value = ''
    copyButton.hidden = true
    clearButton.hidden = true
}

async function getData() {
    try {
        if(!url.value){
            alert("Please enter a link from youtube.com")
        }
        
        textarea.textContent = `Summarizing...`
        const summaryFetch = await fetch(`/api/summary?url=${encodeURIComponent(url.value)}`)
        const {summarization} = await summaryFetch.json()
        textarea.textContent = summarization
        copyButton.hidden = false
        clearButton.hidden = false
        
    } catch (err) {
        textarea.textContent = `Something went wrong with your request, Please try again.`
    }
}

button.addEventListener(`click`, getData)
copyButton.addEventListener(`click`, copyClipboard)
clearButton.addEventListener(`click`, clearInputs)