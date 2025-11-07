import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Safe storage in environment
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Menti, a friendly AI study buddy for medical students. Always encourage, simplify, and never provide medical advice.",
        },
        ...messages,
      ],
      max_tokens: 250,
    });

    const content = completion.choices[0].message.content;
    res.status(200).json({ content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
}
