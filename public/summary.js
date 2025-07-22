const url = document.querySelector(`.vidLink`)
const actualSummary = document.querySelector(`#generatedContent`)

async function getData() {
    const summaryFetch = fetch(`/summary?rul=${url}`)
    const scriptData = await summaryFetch.json()
}