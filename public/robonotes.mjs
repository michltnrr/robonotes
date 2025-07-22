import { YoutubeTranscript } from 'youtube-transcript';
import dotenv from 'dotenv'
import OpenAI from 'openai';
dotenv.config({ path: '../.env' })
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

async function getTranscript() {
    // demo url: https://www.youtube.com/watch?v=OJjfLuK9Jlo
    const transcript = await YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=OJjfLuK9Jlo')
    let text = ''
    for (let i = 0; i < transcript.length; i++) {
        text += transcript[i].text + ' ';
    }
    return text
}

const openai = new OpenAI();
const prompt = "Given the transcript of this video, summarize the main ideas in 2 paragraphs, then using bullet points, \
outline each section, and describe the main points of each section,\
then for the conclusion do a final summary with the key takeaways, closing with a remark that ties back into the initial main point.";

const gpt = function(str) {
    for (let i = 0; i < str.length; i++) {
        setTimeout(() => process.stdout.write(str[i]), i * 1.3);
    }
};

async function main() {
        const script = await getTranscript();
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: script }
            ],
            model: "gpt-3.5-turbo",
        });
        gpt(completion.choices[0].message.content);
}
main()