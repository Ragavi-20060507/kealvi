"use client";

import { useState } from "react";

export default function PollPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [poll, setPoll] = useState<any>(null);

  async function generatePoll() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-poll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      // ✅ FIX: store only poll object
      setPoll(data.poll);

    } catch (error) {
      console.error("Error generating poll:", error);
    }

    setLoading(false);
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">AI Poll Generator</h1>

      <input
        className="border p-3 mt-5 w-full"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button
        className="bg-black text-white px-5 py-3 mt-4"
        onClick={generatePoll}
      >
        {loading ? "Generating..." : "Generate Poll"}
      </button>

      {/* ✅ Safe render */}
      {poll && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">{poll.question}</h2>

          <div className="mt-4">
            {(poll.options || []).map((opt: string, index: number) => (
              <div key={index} className="border p-3 mt-2">
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}