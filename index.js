// index.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// load user info from env (recommended) or fallback to defaults
const FULL_NAME = (process.env.USER_FULL_NAME || 'OUttejKumar').toLowerCase().replace(/\s+/g, '_'); // e.g. "john doe" -> "john_doe"
const DOB_DDMMYYYY = process.env.USER_DOB || '13082005'; // ddmmyyyy
const EMAIL = process.env.USER_EMAIL || 'uttejkumar2003@gmail.com';
const ROLL_NUMBER = process.env.USER_ROLL || '22BCE20179';

function buildUserId() {
  return `${FULL_NAME}_${DOB_DDMMYYYY}`;
}

function isIntegerString(s) {
  
  return /^-?\d+$/.test(s);
}
function isAlphaString(s) {
  return /^[A-Za-z]+$/.test(s);
}

app.post('/bfhl', (req, res) => {
  try {
    const body = req.body;
    if (!body || !Array.isArray(body.data)) {
      return res.status(400).json({ is_success: false, message: "'data' must be an array" });
    }

    const data = body.data;
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

   
    const lettersForConcat = [];

    for (const item of data) {
      const s = String(item);

      if (isIntegerString(s)) {
        const n = parseInt(s, 10);
        if (n % 2 === 0) even_numbers.push(s); else odd_numbers.push(s);
        sum += n;
      } else if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase());
       
        lettersForConcat.push(...s.split(''));
      } else {

        special_characters.push(s);
       
      }
    }

    const reversedLetters = lettersForConcat.reverse();
    let concat_string = reversedLetters
      .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join('');

    const response = {
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
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ is_success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
