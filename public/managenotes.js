const token = localStorage.getItem(`token`)
const courseFilter = document.getElementById('courseFilter')
const typeFilter = document.getElementById('typeFilter')
const notesGrid = document.querySelector('.notes-grid')

const modal = document.getElementById('modal')
const modalBody = document.getElementById('modalBody')
const closeModal = document.getElementById('closeModal')

const searchBar = document.querySelector(`.search-box`)

async function getCourses() {
    
    const userCourses = await fetch(`/courses`, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    })
return await userCourses.json()
}

async function populateDropdown() {
    const courses = await getCourses()
    console.log(courses)

    courses.forEach(c => {
        const option = document.createElement('option')
        option.value = c._id
        option.textContent = c.name

        courseFilter.appendChild(option)
    })
}
document.addEventListener('DOMContentLoaded', populateDropdown)

const state = {
    course: 'all',
    type: 'all',
    search: ''
}

let currentNotes = []

async function getandrenderNotes() {
    const params = new URLSearchParams()

    if(state.course !== 'all') {
        params.append('course', state.course)
    }

    if(state.type !== 'all') {
        params.append('type', state.type)
    }

    const notes = await fetch(`/notes?${params.toString()}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    const data = await notes.json()

    currentNotes = data.notes
    renderNotes(currentNotes)
}


function renderNotes(notes) {
    notesGrid.innerHTML = ''

    notes.forEach(note => {

        const card = document.createElement('div')
        card.className = 'note-card'
        card.dataset.id = note._id

        // ----- HEADER -----
        const header = document.createElement('div')
        header.className = 'note-header'

        const titleSection = document.createElement('div')
        titleSection.className = 'note-title-section'

        const title = document.createElement('div')
        title.className = 'note-title'

        // Title logic
        if (note.noteType === 'video') {
            title.textContent = note.metadata?.title || 'Video Note'
        } else {
            title.textContent = note.prompt || 'Untitled'
        }

        const course = document.createElement('div')
        course.className = 'note-course'
        course.textContent = note.course?.subject || note.course?.name || 'Course'


        const type = document.createElement('span')
        type.className = 'note-type'
        type.textContent = note.noteType

        titleSection.appendChild(title)
        titleSection.appendChild(course)

        header.appendChild(titleSection)
        header.appendChild(type)

        // ----- CONTENT PREVIEW -----
        const content = document.createElement('div')
        content.className = 'note-content'

        if (note.noteType === 'video') {
            content.textContent = `Video file path: ${note.metadata?.path || ''}`
        }

        if (note.noteType === 'summary') {
            content.textContent = note.metadata?.content || ''
        }

        if (note.noteType === 'quiz') {
            content.textContent = 'Click view to see quiz questions'
        }

        if (note.noteType === 'essay') {
            content.textContent = note.metadata?.essay || ''
        }

        // ----- FOOTER -----
        const footer = document.createElement('div')
        footer.className = 'note-footer'

        const date = document.createElement('div')
        date.className = 'note-date'
        date.textContent = new Date(note.createdAt).toLocaleDateString()

        const actions = document.createElement('div')
        actions.className = 'note-actions'

        // View button (not for video)
        if (note.noteType !== 'video') {
            const viewBtn = document.createElement('button')
            viewBtn.className = 'view-btn'
            viewBtn.textContent = 'View'
            viewBtn.dataset.id = note._id
            viewBtn.dataset.action = 'view'
            actions.appendChild(viewBtn)
        }

        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'delete-btn'
        deleteBtn.textContent = 'Delete'
        deleteBtn.dataset.id = note._id
        deleteBtn.dataset.action = 'delete'

        actions.appendChild(deleteBtn)

        footer.appendChild(date)
        footer.appendChild(actions)

        // ----- APPEND EVERYTHING -----
        card.appendChild(header)
        card.appendChild(content)
        card.appendChild(footer)

        notesGrid.appendChild(card)
    })
}

function openModal(note) {

    if (note.noteType === 'summary') {
        modalBody.innerHTML = `
           <a href='${note.prompt}' target="_blank" class="modal-link"><h2>${note.metadata?.title || 'Link to video here'}</a></h2>
            <p>${note.metadata?.content}</p>
        `
    }

    if (note.noteType === 'quiz') {
        const questionsHTML = note.metadata?.questions?.map(q => {

        const optionsHTML = q.options?.map(option => `
            <p style="${option.id === q.correctAnswer ? 'color:#2da8d2; font-weight:600;' : ''}">
                ${option.id}. ${option.text}
            </p>
        `).join('')

        return `
            <div class="question">
                <p><strong>${q.question}</strong></p>
                ${optionsHTML}
            </div>
        `
    }).join('')


    modalBody.innerHTML = `
        <h2>${note.metadata?.title}</h2>
        ${questionsHTML}
    `
    }
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
}

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden')
    document.body.style.overflow = 'auto'
})

modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        modal.classList.add('hidden')
    }
})


document.addEventListener('DOMContentLoaded', async () => {
    await getandrenderNotes()
})


notesGrid.addEventListener('click', async (e) => {

    const card = e.target.closest('.note-card')
    if (!card) return

    const id = card.dataset.id
    const note = currentNotes.find(n => n._id === id)

    // DELETE
    if (e.target.classList.contains('delete-btn')) {

        await fetch(`/notes/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        currentNotes = currentNotes.filter(note => note._id !== id)
        card.remove()
    }

    // VIEW
    if (e.target.classList.contains('view-btn')) {
        openModal(note)
    }

})

courseFilter.addEventListener('change', () => {
    state.course = courseFilter.value
    getandrenderNotes()
})

typeFilter.addEventListener('change', () => {
    state.type = typeFilter.value.toLowerCase()
    getandrenderNotes()
})

searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim()

    if(!query) {
        renderNotes(currentNotes)
        return 
    }

    const filtered = currentNotes.filter(note => {

        const title = (note.metadata?.title || note.prompt || 'note').toLowerCase()
        return title.includes(query)
    })

    renderNotes(filtered)
})