const url = document.querySelector(`.vidLink`)
const textarea = document.querySelector(`#generatedContent`)
const button = document.querySelector(`.generator`)

async function getData() {
    const summaryFetch = await fetch(`/summary?url=${encodeURIComponent(url.value)}`)
    const {summarization} = await summaryFetch.json()
    textarea.value = summarization
}

button.addEventListener(`click`, getData)