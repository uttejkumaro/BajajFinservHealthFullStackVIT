require('dotenv').config();
const express = require('express');
const app = express();

// Middleware: catch invalid JSON
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ is_success: false, message: "Invalid JSON" });
  }
  next();
});

// User info
const FULL_NAME = (process.env.USER_FULL_NAME || 'uttej kumar')
  .toLowerCase()
  .replace(/\s+/g, '_');
const DOB_DDMMYYYY = process.env.USER_DOB || '13082005';
const EMAIL = process.env.USER_EMAIL || 'uttejkumar2003@gmail.com';
const ROLL_NUMBER = process.env.USER_ROLL || '22BCE20179';

function buildUserId() {
  return `${FULL_NAME}_${DOB_DDMMYYYY}`;
}
function isIntegerString(s) { return /^-?\d+$/.test(s); }
function isAlphaString(s) { return /^[A-Za-z]+$/.test(s); }

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running. Use POST /bfhl" });
});

// Main route
app.post("/bfhl", (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({ is_success: false, message: "'data' must be an array" });
    }

    const odd_numbers = [], even_numbers = [], alphabets = [], special_characters = [];
    let sum = 0, lettersForConcat = [];

    for (const item of body.data) {
      const s = String(item);
      if (isIntegerString(s)) {
        const n = parseInt(s, 10);
        (n % 2 === 0 ? even_numbers : odd_numbers).push(s);
        sum += n;
      } else if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase());
        lettersForConcat.push(...s.split(""));
      } else {
        special_characters.push(s);
      }
    }

    const concat_string = lettersForConcat
      .reverse()
      .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join('');

    res.json({
      is_success: true,
      user_id: buildUserId(),
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ is_success: false, message: "Internal Server Error" });
  }
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
