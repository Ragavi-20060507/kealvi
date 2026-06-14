import { NextResponse } from "next/server";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
  searchCount: number;
};

// 🧠 In-memory database (for now)
let questions: Question[] = [
  {
    id: "1",
    body: "What is Next.js?",
    author: "system",
    votes: 0,
    searchCount: 0,
  },
];

// 🔍 GET (list + search + pagination + search tracking)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.toLowerCase() || "";
  const offset = Number(searchParams.get("offset") || 0);

  let filtered = questions;

  // ✅ SEARCH LOGIC + SEARCH COUNT INCREASE
  if (q) {
    filtered = filtered.map((item) => {
      if (item.body.toLowerCase().includes(q)) {
        return {
          ...item,
          searchCount: item.searchCount + 1, // 🔥 increases when searched
        };
      }
      return item;
    });

    questions = filtered; // persist updated searchCount in memory
  }

  const result = filtered.filter((item) =>
    item.body.toLowerCase().includes(q)
  );

  const paginated = result.slice(offset, offset + 10);

  return NextResponse.json({
    questions: paginated,
    hasMore: offset + 10 < result.length,
  });
}

// ➕ CREATE QUESTION
export async function POST(req: Request) {
  const body = await req.json();

  const newQuestion: Question = {
    id: String(Date.now()),
    body: body.body,
    author: "user",
    votes: 0,
    searchCount: 0,
  };

  questions.unshift(newQuestion);

  return NextResponse.json(newQuestion);
}