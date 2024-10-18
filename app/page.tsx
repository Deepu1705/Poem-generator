"use client"; // This line makes the component a Client Component

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [poem, setPoem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("/api/generatePoem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setPoem(data.poem);
      } else {
        setPoem(data.error || "Error generating poem"); // Use returned error message if available
      }
    } catch (error) {
      console.error("Error:", error);
      setPoem("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading in either case
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Poem Generator</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a theme or topic"
          required
          className="border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading} // Disable button when loading
        >
          {loading ? "Generating..." : "Generate Poem"}
        </button>
      </form>
      <h2 className="text-xl font-semibold mt-8">Generated Poem:</h2>
      <pre className="border border-gray-300 p-4 rounded mt-4 w-full max-w-md">
        {poem}
      </pre>
    </div>
  );
}
