import dotenv from 'dotenv'
import OpenAI from 'openai';
dotenv.config()

const openai = new OpenAI();
const prompt = "Given the transcript of this video, summarize the main ideas in 2 paragraphs, then using bullet points, \
outline each section, and describe the main points of each section,\
then for the conclusion do a final summary with the key takeaways, closing with a remark that ties back into the initial main point.";

export async function main(script) {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: script }
            ],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content
}