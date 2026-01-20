import OpenAI from "openai";
import 'dotenv/config'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})

export async function createQuiz(prompt) {
    const res = await client.responses.create({
        model: "gpt-4.1",
        input: `${prompt}
        
        Your response should be a JSON object that represents a multiple choice quiz, with the specified number of questions, pls return the JSON in the given example structure, dont the exact
        hard coded values, these are simply to exemplify the required structure 
        
        Return ONLY valid JSON.
        Do not include explanations, markdown, or extra text.
        The response MUST be directly parsable by JSON.parse().
        
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
})

  const quizObj = res.output_text
  return JSON.parse(quizObj)
}