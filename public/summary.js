const url = document.querySelector(`.vidLink`)
const textarea = document.querySelector(`#generatedContent`)
const button = document.querySelector(`.generator`)

async function getData() {
    textarea.textContent = `Summarizing...`
    const summaryFetch = await fetch(`/api/summary?url=${encodeURIComponent(url.value)}`)
    const {summarization} = await summaryFetch.json()
    textarea.textContent = summarization
}

button.addEventListener(`click`, getData)