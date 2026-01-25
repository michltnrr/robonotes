const OpenAI = require("openai");
require('dotenv').config()
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY})
const { manimReference } = require('./manim-reference.js');


async function prepVideo(concept) {
    const prompt = `${manimReference}

You are an expert Python animator specializing in Manim Community v0.19+.

CRITICAL: ONLY use methods and colors listed in the API REFERENCE above. If something isn't listed, it DOESN'T EXIST.

Your task is to generate a clear, educational animation that visually explains a concept to a student.

RULES:
- Output ONLY valid Python Manim code.
- Do NOT include explanations, comments, or markdown.
- Use a single Scene class.
- The code must run without any post-processing or manual fixes.
- Video must be 40-60 seconds long

TIME CONSTRAINTS (CRITICAL):
- You MUST explicitly control timing using self.wait() and animation run times.
- Include at least **10 self.wait() calls**, each lasting **1–3 seconds**.
- Include at least **12 self.play() calls**.
- No single animation may communicate a full idea instantly.
- Text must remain on screen long enough to be read before transitioning.

ANIMATION STYLE:
- Introduce the topic with a title.
- Build the visualization step-by-step.
- Use simple, clear animations.
- Include descriptive text alongside animations.
- Create a 5-step process explaining how to solve/understand the problem.
- Prioritize clarity over complexity.

LAYOUT CONSTRAINTS (CRITICAL):
- All text must remain fully inside the camera frame at all times.
- Use .to_edge(UP/DOWN/LEFT/RIGHT) or .next_to() for ALL positioning.
- Never place objects using raw .shift() without anchoring.
- Limit all Text and MathTex to a max width of 10 units using ".scale()" if needed.
- Never display more than 3 text objects on screen at once.
- Always fade out or remove old objects before introducing new ones.
- Avoid stacking text vertically without spacing (buff >= 0.5).

AXES RULE:
- Axis labels must ONLY be created using "axes.get_x_axis_label()" and "axes.get_y_axis_label()".
- Never pass color or font_size directly into the constructor unless shown in the reference.

The animation should visualize the following concept:
"${concept}"
`;

    const res = await client.responses.create({
        model: "gpt-4.1",
        input: prompt
    });

    const generatedCode = res.output_text?.trim();
    if (!generatedCode) throw new Error("GPT did not return any code");

    return generatedCode;
}

function getsceneName(code) {
    const match = code.match(/class\s+(\w+)\s*\(\s*Scene\s*\)\s*:/);
    if (!match) {
        throw new Error('No Manim Scene class found in generated code');
    }
    return match[1];
}
module.exports = {prepVideo, getsceneName}