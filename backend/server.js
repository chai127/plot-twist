require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- AI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    // This setting helps reduce randomness for structured data
    generationConfig: { temperature: 0.4 } 
});

// --- THE LOGIC ---
app.post('/api/query', async (req, res) => {
  console.log("📩 User Query:", req.body.query);
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: "Query required" });

  const systemPrompt = `
    You are an API that outputs strictly JSON. You are a highly intelligent Math Tutor specializing in Vectors and Linear Algebra.
    
    1. ANALYZE the user's request.
    2. DETERMINES the intent (type and operation).
    3. EXTRACTS parameters (vectors, numbers) if provided.
    4. GENERATES illustrative parameters if the user did NOT provide them (e.g., if they just say "show me addition", you create two nice vectors to demonstrate).
    5. EXPLAINS the concept in depth using LaTeX for math equations. Use '$' for inline math and '$$' for block equations.

    RETURN ONLY JSON. DO NOT use Markdown code blocks (like \`\`\`json). Just the raw JSON string.
    
    The JSON structure must be:
    {
      "type": "vector",
      "operation": "addition" | "subtraction" | "dot_product" | "cross_product" | "projection" | "general_concept",
      "params": {
        "a": [x, y],  // Start point or Vector A
        "b": [x, y]   // End point or Vector B (optional depending on operation)
      },
      "explanation": "A long, detailed educational explanation string with LaTeX...",
      "title": "A short 3-5 word title for the lesson"
    }
  `;

  const finalPrompt = `${systemPrompt}\n\nUSER QUERY: "${query}"`;

  try {
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    let text = response.text();

    // CLEANUP: Sometimes AI adds markdown wrappers despite instructions. Remove them.
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse to ensure it's valid JSON before sending to frontend
    const jsonResponse = JSON.parse(text);

    console.log("✅ AI Generated Valid JSON");
    res.json(jsonResponse);

  } catch (error) {
    console.error("🔥 AI/Parse Error:", error);
    // Fallback if AI fails to generate strict JSON
    res.status(500).json({ 
      error: "AI failed to generate structured lesson", 
      raw_text: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Tutor Engine running on http://localhost:${PORT}`);
});