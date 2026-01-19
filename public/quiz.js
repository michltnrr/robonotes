import OpenAI from "openai";
import 'dotenv/config'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})

async function createQuiz(prompt) {
    const res = await client.responses.create({
        model: "gpt-4.1",
        input: `${prompt}
        
        Your response should be a JSON object that represents a multiple choice quiz, with the specified number of questions, pls return the JSON in the given example structure, dont the exact
        hard coded values, these are simply to exemplify the required structure 

        example structure:

        \`\`\`
{
  "quizTitle": "Photosynthesis Basics",
  "topic": "Biology",
  "questions": [
    {
      "id": 1,
      "question": "What is the primary purpose of photosynthesis?",
      "options": [
        { "id": "A", "text": "To produce oxygen for animals" },
        { "id": "B", "text": "To convert light energy into chemical energy" },
        { "id": "C", "text": "To absorb water from the soil" },
        { "id": "D", "text": "To release carbon dioxide" }
      ],
      "correctAnswer": "B",
      "explanation": "Photosynthesis converts light energy into chemical energy stored in glucose."
    }
  ]
}
\`\`\`
`
  });
  return res
}
async function main() {
    const quiz = await createQuiz('Generate a 10 question quiz on javascrript')
    console.log(quiz.output_text)
}
main()