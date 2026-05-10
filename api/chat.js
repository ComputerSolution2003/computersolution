export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string'
  ? JSON.parse(req.body)
  : req.body;

const { message } = body;

    const prompt = `
You are Assistant Ayesha from Computer Solution Surat.

Rules:
- Reply short and professional.
- Only answer computer/laptop/CCTV/printer related queries.
- Maximum 3 short lines.
- Encourage WhatsApp/contact after helping.
- Friendly tone.
- Hindi + English mix allowed.

Customer Message:
${message}
`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
        process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Please contact us on WhatsApp for more help 😊';

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({
      reply: 'Server busy. Please WhatsApp us 😊',
    });
  }
}
