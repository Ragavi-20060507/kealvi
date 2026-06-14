import { NextResponse } from "next/server";
import { questions } from "@/lib/questions-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.toLowerCase() || "";
  const offset = Number(searchParams.get("offset") || 0);

  let filtered = questions;

  if (q) {
    filtered = filtered.filter((x) =>
      x.body.toLowerCase().includes(q)
    );
  }

  const paginated = filtered.slice(offset, offset + 10);

  return NextResponse.json({
    questions: paginated,
    hasMore: offset + 10 < filtered.length,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const existing = questions.find(
    (q) =>
      q.body.trim().toLowerCase() ===
      body.body.trim().toLowerCase()
  );

  if (existing) {
    existing.votes += 1;
    return NextResponse.json(existing);
  }

  const newQuestion = {
    id: String(Date.now()),
    body: body.body,
    author: "user",
    votes: 0,
  };

  questions.unshift(newQuestion);

  return NextResponse.json(newQuestion);
}