import { main } from './robonotes.js'; 

const button = document.querySelector('.generator'); 
button.addEventListener('click', async () => { 
    const data = document.getElementById('generatedContent');
    data.innerHTML = await main(); 
});
