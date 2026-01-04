app.post("/generate-tribute", async (req, res) => {
  const { petName, dates, details } = req.body;

  const prompt = `
You are a gentle memorial-writing assistant.
Generate ONE tribute paragraph in a warm, balanced tone.

Use ONLY the information provided by the user:
- Pet’s name: ${petName}
- Dates: ${dates}
- Details: ${details}

Rules:
- Do not invent new traits or events.
- Do not ask questions.
- Do not create a conversation.
- Do not add extra sections.
- Do not mention yourself.
- Produce one complete, emotionally warm paragraph.
`;

  const aiResponse = await model.generate(prompt);

  res.json({ tribute: aiResponse });
});
