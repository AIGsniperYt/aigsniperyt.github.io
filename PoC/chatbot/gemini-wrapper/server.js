import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: path.join(import.meta.dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(import.meta.dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    const { prompt, model: modelName } = req.body;
    const model = genAI.getGenerativeModel({ model: modelName || "gemini-2.5-flash-lite" });
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) send({ text });
    }
    send({ done: true });
  } catch (err) {
    send({ error: err.message });
  } finally {
    res.end();
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
