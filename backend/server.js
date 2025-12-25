require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend build directory
const frontendPath = path.join(__dirname, "../plot-twist/dist");
app.use(express.static(frontendPath));

// --- GEMINI SETUP ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 1500,
  },
});

// ---------- HELPERS ----------
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Invalid JSON from AI");
  }
  return JSON.parse(text.slice(start, end + 1));
}

// ---------- VECTOR ENDPOINT ----------
app.post("/api/vector", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  const prompt = `
You are a Vector Math API.

Return ONLY valid JSON in this format:
{
  "type": "vector",
  "operation": "addition | dot_product",
  "params": { "a": [number, number], "b": [number, number] },
  "explanation": "Detailed step-by-step LaTeX explanation (2-3 sentences with math formulas)",
  "intuition": "Clear intuitive explanation of what this operation means (2-3 sentences)",
  "title": "Short descriptive title"
}

Rules:
- Never output anything except JSON
- Always include both vectors
- Make explanation detailed with actual math notation
- Make intuition easy to understand
`;

  try {
    const result = await model.generateContent(`${prompt}\nUser: ${query}`);
    const text = result.response.text();
    const json = extractJSON(text);

    if (json.type !== "vector") {
      throw new Error("Invalid vector response");
    }

    res.json(json);
  } catch (err) {
    console.error("🔥 VECTOR ERROR:", err.message);
    res.status(500).json({ error: "Vector generation failed" });
  }
});

// ---------- FUNCTION ENDPOINT ----------
app.post("/api/function", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  const prompt = `
You are an Expert Math Function API for interactive visualization and learning.

AVAILABLE FUNCTIONS (choose exactly ONE):
sin, cos, tan, sinh, cosh, tanh, exp, log, abs, sqrt, cbrt, reciprocal, asin, acos

RESPONSE FORMAT - Return ONLY valid JSON, no other text:
{
  "type": "function",
  "operation": "sin | cos | tan | sinh | cosh | tanh | exp | log | abs | sqrt | cbrt | reciprocal | asin | acos",
  "params": { "x": number },
  "explanation": "Detailed mathematical explanation with LaTeX (include formula, domain, range, key properties, 3-4 sentences)",
  "intuition": "Real-world or visual analogy explanation (what does this function represent in nature/physics?, 2-3 sentences)",
  "title": "Clear short title describing the function"
}

FUNCTION DESCRIPTIONS FOR CONTEXT:
- sin/cos/tan: Trigonometric functions from angles
- sinh/cosh/tanh: Hyperbolic functions (exponential based)
- exp: Exponential growth (e^x)
- log: Natural logarithm (only for x > 0)
- sqrt: Square root (only for x >= 0)
- cbrt: Cube root (works for all x)
- abs: Absolute value (distance from zero)
- reciprocal: 1/x (undefined at 0)
- asin/acos: Inverse trig functions (domain -1 to 1)

CRITICAL RULES:
- Output ONLY the JSON object, nothing else
- NEVER include cube, polynomial, power, derivative, or quadratic functions
- Always provide accurate domain/range
- Explain why the function matters
- Use proper LaTeX for mathematical notation: $formula$ for inline
- Make explanation suitable for educational visualization
`;

  try {
    const result = await model.generateContent(`${prompt}\nUser query: ${query}`);
    const text = result.response.text();
    const json = extractJSON(text);

    const ALLOWED = ["sin", "cos", "tan", "sinh", "cosh", "tanh", "exp", "log", "sqrt", "cbrt", "abs", "reciprocal", "asin", "acos"];
    if (!ALLOWED.includes(json.operation)) {
      throw new Error(`Unsupported function: ${json.operation}`);
    }

    res.json(json);
  } catch (err) {
    console.error("🔥 FUNCTION ERROR:", err.message);
    res.status(500).json({ error: "Function generation failed: " + err.message });
  }
});

// Catch-all route for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () =>
  console.log(`🚀 Tutor Engine running at http://localhost:${PORT}`)
);
