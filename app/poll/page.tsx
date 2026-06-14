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

      // Check if API failed
      if (!res.ok) {
        const text = await res.text();
        console.log("API Error:", text);
        throw new Error("API failed");
      }

      const data = await res.json();

      if (data.success) {
        setPoll(data.poll);
      } else {
        alert(data.error || "Failed to generate poll");
      }

    } catch (error) {
      console.error("Error generating poll:", error);
      alert("Something went wrong");
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

      {poll && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">
            {poll.question}
          </h2>

          <div className="mt-4">
            {(poll.options || []).map(
              (opt: string, index: number) => (
                <div
                  key={index}
                  className="border p-3 mt-2"
                >
                  {opt}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}