export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image, style } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Analyze this image and generate a highly detailed ${style} AI image prompt.` },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 350
      })
    });

    const data = await response.json();
    res.status(200).json({ prompt: data.choices[0].message.content });

  } catch (e) {
    res.status(500).json({ error: "AI processing failed" });
  }
}
