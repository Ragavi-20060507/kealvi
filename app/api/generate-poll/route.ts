import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const prompt = `
Create ONE poll.

Topic: ${body.topic}

Return ONLY valid JSON.

Format:

{
 "question":"...",
 "options":["option1","option2","option3","option4"]
}
`;

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = res.text ?? "";

    // remove markdown wrappers if Gemini adds them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const poll = JSON.parse(text);

    return Response.json(poll);

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error: "Failed generating poll"
      },
      {
        status: 500
      }
    );

  }
}