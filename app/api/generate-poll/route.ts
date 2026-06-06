import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const topic = body.topic;

    let options: string[] = [];

    if (topic.toLowerCase().includes("horror")) {
      options = [
        "The Conjuring",
        "Hereditary",
        "The Exorcist",
        "Insidious",
      ];
    } else if (topic.toLowerCase().includes("movie")) {
      options = [
        "Inception",
        "Interstellar",
        "The Dark Knight",
      ];
    } else {
      options = [
        `Option related to ${topic} 1`,
        `Option related to ${topic} 2`,
        `Option related to ${topic} 3`,
      ];
    }

    return NextResponse.json({
      success: true,
      poll: {
        question: `What do you think about: ${topic}?`,
        options,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}