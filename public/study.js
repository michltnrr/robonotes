const input = document.getElementById('mainInput');
const submitBtn = document.getElementById('submitBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const outputSection = document.getElementById('outputSection');
const outputContent = document.getElementById('outputContent');
const quizContainer = document.getElementById('quizContainer');

let currentMode = 'video';

// Auto-resize textarea
input.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Mode switching
modeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        modeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentMode = this.dataset.mode;
        if (currentMode === 'video') {
            input.placeholder = 'Visualize the mechanics of hydrostatic force...';
        } else if(currentMode === 'quiz'){
            input.placeholder = 'Describe your quiz (e.g., "10 questions on photosynthesis")...';
        } else {
            input.placeholder = 'Paste a YT video url for a summarization or upload a pdf...';
        }
    });
});

function renderQuiz(quizData) {
    const quizContainer = document.getElementById('quizContainer');

    quizContainer.hidden = false;
    quizContainer.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = quizData.quizTitle;
    quizContainer.appendChild(title);

    quizData.questions.forEach((q) => {
        const form = document.createElement('form');
        form.className = 'quiz-contents';

        const questionEl = document.createElement('p');
        questionEl.className = 'quiz-question';
        questionEl.textContent = `${q.id}. ${q.question}`;
        form.appendChild(questionEl);

        q.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${q.id}`;
            input.id = `q${q.id}-${option.id}`;

            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = `${option.id}. ${option.text}`;

            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            form.appendChild(optionDiv);
        });

        quizContainer.appendChild(form);
    });
}



//submit
async function generate() {
    const promptAction = input.value.trim()
    if(!promptAction) return
    
    const content = await fetch(`/study/generate`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            mode: currentMode,
            prompt: promptAction
        })
    })

    if(!content.ok) {
        const text = await content.text()
        console.log(`Server error`, text)
        return 
    }
    const response = await content.json()
    console.log(response)

    if(currentMode === 'quiz') {
        outputSection.classList.remove('active')
        renderQuiz(response.data)
    } else {
        outputSection.classList.add('active')
        outputContent.textContent = response.data
    }
}

submitBtn.addEventListener('click', generate);
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        console.log('Generation started')
        e.preventDefault();
        generate();
    }
});