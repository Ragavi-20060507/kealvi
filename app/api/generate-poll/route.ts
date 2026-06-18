import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          error: "Topic required",
        },
        { status: 400 }
      );
    }

    const lowerTopic = topic.toLowerCase();

    let question = topic;
    let options: string[] = [];

    if (lowerTopic.includes("horror")) {
      question = "Which horror movie do you like most?";
      options = [
        "The Conjuring",
        "Hereditary",
        "Insidious",
        "The Exorcist",
      ];
    }

    else if (lowerTopic.includes("sport")) {
      question = "Which sport do you enjoy the most?";
      options = [
        "Cricket",
        "Football",
        "Basketball",
        "Tennis",
      ];
    }

    else if (lowerTopic.includes("programming")) {
      question = "Which programming language do you prefer?";
      options = [
        "Python",
        "JavaScript",
        "Java",
        "C++",
      ];
    }

    else if (lowerTopic.includes("movie")) {
      question = "Which movie do you like most?";
      options = [
        "Inception",
        "Interstellar",
        "Avatar",
        "The Dark Knight",
      ];
    }

    else if (lowerTopic.includes("food")) {
      question = "Which food do you prefer?";
      options = [
        "Pizza",
        "Burger",
        "Pasta",
        "Biryani",
      ];
    }

    else if (lowerTopic.includes("social")) {
      question = "Which social media platform do you use most?";
      options = [
        "Instagram",
        "YouTube",
        "Facebook",
        "X (Twitter)",
      ];
    }

    else if (lowerTopic.includes("music")) {
      question = "Which music genre do you prefer?";
      options = [
        "Pop",
        "Rock",
        "Hip Hop",
        "Classical",
      ];
    }

    else if (lowerTopic.includes("mobile")) {
      question = "Which mobile brand do you prefer?";
      options = [
        "Apple",
        "Samsung",
        "OnePlus",
        "Xiaomi",
      ];
    }

    else {
      question = "Choose your favorite option";
      options = [
        "Option A",
        "Option B",
        "Option C",
        "Option D",
      ];
    }

    return NextResponse.json({
      success: true,
      poll: {
        question,
        options,
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate poll",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Poll API Running",
  });
}