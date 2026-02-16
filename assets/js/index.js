import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/healing-agent", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.agent.ai/v1/action/invoke_agent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HEALING_AGENT_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: process.env.HEALING_AGENT_ID,
        user_input: userMessage
      })
    });

    const data = await response.json();
    res.json({ reply: data.output || "The agent did not return a response." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "There was an error contacting the Healing Agent." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
