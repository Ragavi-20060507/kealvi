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
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions ?? []
  );

  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const url = query
          ? `/api/questions?q=${encodeURIComponent(query)}`
          : `/api/questions`;

        const res = await fetch(url);
        const data = await res.json();

        const incoming = data.questions ?? [];

        // ✅ REMOVE DUPLICATES PROPERLY
        setQuestions((prev) => {
          const map = new Map();

          [...prev, ...incoming].forEach((q) => {
            if (q?.id) map.set(q.id, q);
          });

          return Array.from(map.values());
        });

        setHasMore(data.hasMore ?? false);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  async function submit() {
    if (!draft.trim()) return;

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: draft,
      }),
    });

    const created = await res.json();

    setQuestions((prev) => {
      if (!created?.id) return prev;

      const exists = prev.some((q) => q.id === created.id);
      if (exists) return prev;

      return [
        {
          id: created.id,
          body: created.body,
          author: created.author,
          votes: created.votes ?? 0,
        },
        ...prev,
      ];
    });

    setDraft("");
  }

  async function upvote(id: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, votes: q.votes + 1 } : q
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
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, votes: q.votes - 1 } : q
        )
      );
    }
  }

  async function loadMore() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/questions?offset=${questions.length}`
      );

      const data = await res.json();

      setQuestions((prev) => {
        const map = new Map();

        [...prev, ...(data.questions ?? [])].forEach((q) => {
          if (q?.id) map.set(q.id, q);
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

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions..."
        className="w-full rounded border px-3 py-2"
      />

      <ul className="space-y-3">
        {questions.map((q) => {
          if (!q?.id) return null;

          return (
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
          );
        })}
      </ul>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded border px-4 py-2"
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}