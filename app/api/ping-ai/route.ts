import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = `
Create ONE poll.

Topic: ${body.topic}

Return ONLY JSON:

{
 "question":"...",
 "options":["option1","option2","option3","option4"]
}
`;

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = res.text ?? "";

  return Response.json(
    JSON.parse(text)
  );
}