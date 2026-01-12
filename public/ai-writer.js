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
    try {
        e.preventDefault();
        if (!essayDone) {
            generateButton.disabled = true;
            generateButton.style.opacity = 0.5;
            generateButton.textContent = `Generating...`;

            const pages = document.querySelector(`#num-pages`).value;
            const essayTitle = document.querySelector(`#title`).value;
            const date = document.querySelector(`#paper-date`).value;
            const profName = document.querySelector(`#professor`).value;
            const usersName = document.querySelector(`#users-fullname`).value;
            const className = document.querySelector(`#classname`).value;
            const guidelines = document.querySelector(`#guidelines`).value;

            const sourceLinks = document.getElementsByClassName(`source-inputs`);
            const linkURLS = Array.from(sourceLinks)
                .map(input => input.value)
                .filter(link => link.trim() !== "");

            const essayFormat = specifyFormat();
            console.log('💡 Selected format:', essayFormat);

            // Generate essay
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

            console.log('💡 Fetching essay from:', url);
            const essayFetch = await fetch(url);
            if (!essayFetch.ok) throw new Error(`Failed to fetch essay: ${essayFetch.status}`);

            const essayData = await essayFetch.json();
            console.log('✅ Essay data received:', essayData);

            const writeResponse = await fetch("/write-doc", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })


            // console.log('💡 /write-doc response received:', writeResponse);

            const writeResult = await writeResponse.json();
            console.log('✅ /write-doc result:', writeResult);
            if (!writeResult.success) throw new Error(writeResult.error);

            essayDone = true;
            generateButton.disabled = false;
            generateButton.style.opacity = 1.0;
            generateButton.textContent = `View Essay`;

        }
    } catch (err) {
        console.error('❌ Error in fetchEssayData:', err);
        generateButton.disabled = false;
        generateButton.style.opacity = 1.0;
        generateButton.textContent = `Unable to generate essay`;
    }
    window.open(`https://docs.google.com/document/d/122c642Y-FaQ-i8R1Nbq95QJIo8sNkd2GaT6SJYT-jq0/edit?tab=t.0`, `_blank`);
}
generateButton.addEventListener(`click`, fetchEssayData);