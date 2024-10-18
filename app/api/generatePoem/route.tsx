import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  // Validate the prompt
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Use the appropriate model for your use case
        messages: [
          { role: "system", content: "You are a helpful assistant." }, // Optional: system message for behavior
          { role: "user", content: prompt },
        ],
        max_tokens: 100, // Adjust based on your requirements
      }),
    });

    const responseBody = await response.text();
    console.log("Gemini response status:", response.status);
    console.log("Gemini response body:", responseBody);

    // Parse the response body as JSON
    const data = JSON.parse(responseBody);

    // Check if the response has choices and return the generated poem
    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ poem: data.choices[0].message.content });
    } else {
      return NextResponse.json({ error: "No poem generated" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate poem" }, { status: 500 });
  }
}
