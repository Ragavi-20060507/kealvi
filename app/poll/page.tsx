"use client";

import { useState } from "react";

export default function PollPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [poll, setPoll] = useState<any>(null);
  const [votes, setVotes] = useState<number[]>([]);

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

      if (!res.ok) {
        const text = await res.text();
        console.log("API Error:", text);
        throw new Error("API failed");
      }

      const data = await res.json();

      if (data.success) {
        setPoll(data.poll);

        setVotes(
          new Array(data.poll.options.length).fill(0)
        );
      } else {
        alert(data.error || "Failed to generate poll");
      }
    } catch (error) {
      console.error("Error generating poll:", error);
      alert("Something went wrong");
    }

    setLoading(false);
  }

  const handleVote = (index: number) => {
    const updatedVotes = [...votes];

    updatedVotes[index] =
      (updatedVotes[index] || 0) + 1;

    setVotes(updatedVotes);
  };

  const resetVotes = () => {
    if (!poll) return;

    setVotes(
      new Array(poll.options.length).fill(0)
    );
  };

  const totalVotes = votes.reduce(
    (sum, vote) => sum + vote,
    0
  );

  const winnerIndex =
    votes.length > 0
      ? votes.indexOf(Math.max(...votes))
      : -1;

  const winner =
    winnerIndex >= 0
      ? poll?.options[winnerIndex]
      : null;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">
        AI Poll Generator
      </h1>

      <input
        className="border p-3 mt-5 w-full rounded"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button
        className="bg-black text-white px-5 py-3 mt-4 rounded"
        onClick={generatePoll}
      >
        {loading ? "Generating..." : "Generate Poll"}
      </button>

      {poll && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold">
            {poll.question}
          </h2>

          <div className="mt-4 mb-4">
            <p className="font-semibold">
              🏆 Leading Option:
              {" "}
              {winner || "No votes yet"}
            </p>

            <p className="mt-2">
              Total Votes: {totalVotes}
            </p>
          </div>

          <div className="mt-4">
            {(poll.options || []).map(
              (opt: string, index: number) => {
                const percentage =
                  totalVotes > 0
                    ? (
                        (votes[index] || 0) /
                        totalVotes
                      ) *
                      100
                    : 0;

                return (
                  <div
                    key={index}
                    className="border p-4 mt-3 rounded"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {opt}
                      </span>

                      <span>
                        {votes[index] || 0} votes
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-3 rounded mt-3">
                      <div
                        className="bg-green-500 h-3 rounded"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <button
                      onClick={() =>
                        handleVote(index)
                      }
                      className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
                    >
                      Vote
                    </button>
                  </div>
                );
              }
            )}
          </div>

          <button
            onClick={resetVotes}
            className="bg-red-600 text-white px-5 py-3 mt-5 rounded"
          >
            Reset Poll
          </button>
        </div>
      )}
    </div>
  );
}