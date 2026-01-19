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

// Submit functionality
function generate() {
    if (!input.value.trim()) return;
    outputSection.classList.add('active');
    outputContent.textContent = 'Generating...';

    setTimeout(() => {
        outputContent.hidden = true;
        quizContainer.hidden = false;
    }, 500);
}

submitBtn.addEventListener('click', generate);
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generate();
    }
});