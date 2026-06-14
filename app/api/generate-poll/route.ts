import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic required" },
        { status: 400 }
      );
    }

    const lowerTopic = topic.toLowerCase();

    let options: string[] = [];

    if (lowerTopic.includes("horror")) {
      options = [
        "The Conjuring",
        "Hereditary",
        "The Exorcist",
        "Insidious",
      ];
    } 
    else if (lowerTopic.includes("movie")) {
      options = [
        "Inception",
        "Interstellar",
        "The Dark Knight",
        "Avatar"
      ];
    } 
    else if (lowerTopic.includes("food")) {
      options = [
        "Pizza",
        "Burger",
        "Pasta",
        "Biryani"
      ];
    } 
    else {
      options = [
        `${topic} Option 1`,
        `${topic} Option 2`,
        `${topic} Option 3`,
        `${topic} Option 4`,
      ];
    }

    return NextResponse.json({
      success: true,
      poll: {
        question: topic,
        options,
      },
    });

  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "API is running",
  });
}