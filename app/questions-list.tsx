"use client";

import { useEffect, useState } from "react";
import { getVoterId } from "@/lib/voter";

type Question = {
  id: string;
  body: string;
  author: string | null;
  votes: number;
};

export default function QuestionsList({
  initialQuestions,
  initialHasMore,
}: {
  initialQuestions: Question[];
  initialHasMore: boolean;
}) {
  const [allQuestions, setAllQuestions] =
    useState<Question[]>(initialQuestions);

  const [questions, setQuestions] =
    useState<Question[]>(initialQuestions);

  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setQuestions(allQuestions);
      return;
    }

    const filtered = allQuestions.filter((q) =>
      q.body.toLowerCase().includes(query.toLowerCase())
    );

    setQuestions(filtered);
  }, [query, allQuestions]);

  async function submit() {
    if (!draft.trim()) return;

    const normalizedDraft = draft.trim().toLowerCase();

    const existingQuestion = allQuestions.find(
      (q) => q.body.trim().toLowerCase() === normalizedDraft
    );

    if (existingQuestion) {
      await upvote(existingQuestion.id);
      setDraft("");
      return;
    }

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: draft,
      }),
    });

    if (!res.ok) return;

    const created = await res.json();

    const newQuestion = {
      id: created.id,
      body: created.body,
      author: created.author,
      votes: created.votes ?? 0,
    };

    setAllQuestions((prev) => [newQuestion, ...prev]);
    setDraft("");
  }

  async function upvote(id: string) {
    setAllQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, votes: q.votes + 1 }
          : q
      )
    );

    const res = await fetch(`/api/questions/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voterId: getVoterId(),
      }),
    });

    if (!res.ok) {
      setAllQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, votes: q.votes - 1 }
            : q
        )
      );
    }
  }

  async function loadMore() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/questions?offset=${allQuestions.length}`
      );

      if (!res.ok) return;

      const data = await res.json();

      const newQuestions = data.questions ?? [];

      setAllQuestions((prev) => {
        const map = new Map();

        [...prev, ...newQuestions].forEach((q) => {
          map.set(q.id, q);
        });

        return Array.from(map.values());
      });

      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Ask Question */}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 rounded border px-3 py-2"
        />

        <button
          onClick={submit}
          className="rounded border px-4 py-2"
        >
          Ask
        </button>
      </div>

      {/* Search Box */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full rounded border px-3 py-2"
      />

      {/* Questions */}
      <ul className="space-y-3">
        {questions.length === 0 ? (
          <li className="rounded border p-3 text-center">
            No questions found
          </li>
        ) : (
          questions.map((q) => (
            <li
              key={q.id}
              className="flex items-center gap-3 rounded border p-3"
            >
              <button
                onClick={() => upvote(q.id)}
                className="rounded border px-3 py-1"
              >
                ▲ {q.votes}
              </button>

              <span>{q.body}</span>
            </li>
          ))
        )}
      </ul>

      {/* Load More */}
      {!query && hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded border px-4 py-2"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}