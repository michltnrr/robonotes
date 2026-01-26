const input = document.getElementById('mainInput');
const submitBtn = document.getElementById('submitBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const outputSection = document.getElementById('outputSection');
const outputContent = document.getElementById('outputContent');
const quizContainer = document.getElementById('quizContainer');
let copyclearDiv = document.querySelector(`.output-actions`)

let copyButton = document.getElementById('clipboard')
let clearButton = document.getElementById('clear')
let quizSubmit;

let currentMode = 'video'

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

copyButton.addEventListener('click', () => {
    const text = outputContent.textContent
    navigator.clipboard.writeText(text)
})

copyButton.addEventListener('mouseenter', () => {
    copyButton.style.color = 'black'
})

copyButton.addEventListener('mouseleave', () => {
    copyButton.style.color = 'white'
})

clearButton.addEventListener('click', () => {
    outputContent.textContent = ''
    outputSection.classList.remove('active')
    
    copyButton.hidden = true
    clearButton.hidden = true
})

clearButton.addEventListener('mouseenter', () => {
    clearButton.style.color = 'black'
})

clearButton.addEventListener('mouseleave', () => {
    clearButton.style.color = 'white'
})

function renderQuiz(quizData) {
    const quizContainer = document.getElementById('quizContainer');
    const quizSection = document.getElementById('quizSection');

    quizSection.classList.add('active');  // Show the quiz section
    quizContainer.className = 'quiz-container';  // Add the styling class
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

        quizSubmit = document.createElement('button')
        quizSubmit.style.backgroundColor = '#f84a64'
        quizSubmit.style.padding = '10px'
        quizSubmit.style.width = '100px'
        quizSubmit.style.borderRadius = '20px'
        quizSubmit.textContent = 'Submit'
        quizSubmit.style.fontSize = '17px'
        quizSubmit.style.color = 'white'
        quizSubmit.style.border = 'none'

        quizContainer.appendChild(form);
    });
    quizContainer.appendChild(quizSubmit)
    
    quizSubmit.addEventListener('mouseenter', () => {
        quizSubmit.style.color = 'black'
    })
    quizSubmit.addEventListener('mouseleave', () => {
        quizSubmit.style.color = 'white'
    })
    quizSubmit.addEventListener('click', () => {
    let score = 0;
    quizData.questions.forEach((q) => {
        let choice = document.querySelector(`input[name=question${q.id}]:checked`)
        if(!choice) return
        
        let answerDiv = choice.closest(`.quiz-option`)
        let selected = choice.id.split(`-`)[1]
        let form = choice.closest('form')
        
        // Find the correct answer option
        let correctChoice = document.querySelector(`#q${q.id}-${q.correctAnswer}`)
        let correctDiv = correctChoice.closest('.quiz-option')

        if(selected === q.correctAnswer) {
            score++;
            // Style correct answer
            answerDiv.style.backgroundColor = 'rgba(74, 222, 128, 0.2)'
            answerDiv.style.border = '2px solid #4ade80'
            answerDiv.style.borderRadius = '8px'
        } else {
            // Style incorrect answer
            answerDiv.style.backgroundColor = 'rgba(248, 74, 100, 0.2)'
            answerDiv.style.border = '2px solid #f84a64'
            answerDiv.style.borderRadius = '8px'
            answerDiv.style.opacity = '0.7'
            
            // Highlight the correct answer
            correctDiv.style.backgroundColor = 'rgba(74, 222, 128, 0.2)'
            correctDiv.style.border = '2px solid #4ade80'
            correctDiv.style.borderRadius = '8px'
        }
        
        // Disable all options for this question
        let allInputs = form.querySelectorAll('input[type="radio"]')
        allInputs.forEach(input => input.disabled = true)
    })
    
    // Display score
    const scoreDisplay = document.createElement('div')
    scoreDisplay.style.textAlign = 'center'
    scoreDisplay.style.margin = '24px 0'
    scoreDisplay.style.padding = '20px'
    scoreDisplay.style.background = '#1a1a1a'
    scoreDisplay.style.border = '1px solid #252525'
    scoreDisplay.style.borderRadius = '12px'
    scoreDisplay.style.fontSize = '1.2rem'
    
    const scoreNumber = document.createElement('div')
    scoreNumber.style.fontSize = '2rem'
    scoreNumber.style.fontWeight = '700'
    scoreNumber.style.background = 'linear-gradient(to right, #4ade80, #2da8d2)'
    scoreNumber.style.webkitBackgroundClip = 'text'
    scoreNumber.style.backgroundClip = 'text'
    scoreNumber.style.color = 'transparent'
    scoreNumber.style.margin = '8px 0'
    scoreNumber.textContent = `${score} / ${quizData.questions.length}`
    
    const percentage = document.createElement('div')
    percentage.style.color = '#888'
    percentage.style.fontSize = '0.9rem'
    percentage.style.marginTop = '8px'
    percentage.textContent = `${Math.round((score / quizData.questions.length) * 100)}% correct`
    
    scoreDisplay.appendChild(document.createTextNode('Your Score'))
    scoreDisplay.appendChild(scoreNumber)
    scoreDisplay.appendChild(percentage)
    
    // Create clear button
    const clearBtn = document.createElement('button')
    clearBtn.style.background = '#333'
    clearBtn.style.border = '1px solid #444'
    clearBtn.style.color = '#fff'
    clearBtn.style.padding = '10px 30px'
    clearBtn.style.borderRadius = '20px'
    clearBtn.style.fontSize = '16px'
    clearBtn.style.cursor = 'pointer'
    clearBtn.style.marginTop = '16px'
    clearBtn.textContent = 'Clear Quiz'
    
    clearBtn.addEventListener('mouseenter', () => {
        clearBtn.style.background = '#444'
    })
    clearBtn.addEventListener('mouseleave', () => {
        clearBtn.style.background = '#333'
    })
    clearBtn.addEventListener('click', () => {
        const quizSection = document.getElementById('quizSection')
        quizSection.classList.remove('active')
    })
    
    scoreDisplay.appendChild(clearBtn)
    
    // Remove submit button and add score display
    quizSubmit.remove()
    quizContainer.insertBefore(scoreDisplay, quizContainer.firstChild)
})
}

function renderVideo(videoSrc) {
    // Ensure output section is visible
    outputSection.classList.add('active')

    // Clear previous output
    outputContent.innerHTML = ''

    // Outer gradient border
    const videoBorder = document.createElement('div')
    videoBorder.className = 'video-border'

    // Inner container
    const videoContainer = document.createElement('div')
    videoContainer.className = 'video-container'

    // Video element
    const video = document.createElement('video')
    video.src = videoSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    video.width = 575
    video.controls = true
    video.playsInline = true

    // Build hierarchy
    videoContainer.appendChild(video)
    videoBorder.appendChild(videoContainer)
    outputContent.appendChild(videoBorder)
   
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
    } 

    else if(currentMode === 'video') {
        console.log("video generatated successfully!")
        renderVideo(response.videoPath)
    }

    else if (currentMode === 'summary') {
        console.log(response)
        outputSection.classList.add('active')
        outputContent.textContent = response.response

        copyButton.style.border = 'none'
        copyButton.style.borderRadius = '20px'
        copyButton.style.font = 'Roboto'
        copyButton.style.fontSize = 'medium'
        copyButton.style.width = '70px'
        copyButton.style.height = '30px'
        copyButton.style.marginLeft = '100px'
        copyButton.style.marginRight = '135px'
        copyButton.style.marginTop = '20px'
        copyButton.style.color = 'white'
        copyButton.style.background =  `linear-gradient(to right, rgb(217, 59, 85), rgb(255, 47, 0))`
        
        clearButton.style.border = 'none'
        clearButton.style.borderRadius = '20px'
        clearButton.style.font = 'Roboto'
        clearButton.style.fontSize = 'medium'
        clearButton.style.width = '70px'
        clearButton.style.height = '30px'
        clearButton.style.marginRight = '135px'
        clearButton.style.marginTop = '20px'
        clearButton.style.color = 'white'
        clearButton.style.background = 'rgb(45, 168, 210)'

        copyButton.hidden = false
        clearButton.hidden = false
    }
    else {
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
})