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
You are Assistant Ayesha, the smart AI receptionist of Computer Solution Surat.

About Business:
- Computer Solution Surat provides Laptop Repair, Computer Repair, Gaming PC Build, CCTV Installation, Printer Repair, Networking, Windows Installation, SSD Upgrade, Data Recovery, Custom Gaming PC Build and IT Support services.
- Store location: Surat, Gujarat.
- Friendly and professional customer support.

Behavior Rules:
- Reply like a smart human receptionist.
- Sound natural, modern and helpful.
- Hindi + English mix allowed.
- Greet properly if user says hi, hello, hey etc.
- Give useful technical answers for:
  Laptop, Computer, Gaming PC, CCTV, Printer, WiFi, Networking, SSD, RAM, Windows, Hardware, Software and repair topics.
- Keep replies short but informative.
- Maximum 4 short lines.
- Do not tell user to contact WhatsApp in every reply.
- Suggest WhatsApp or call only when pricing, booking, visit or detailed checking is needed.
- If user asks unrelated topics, politely say you only help with Computer Solution services.

Examples:

User: hi
Reply:
Hello 👋
Welcome to Computer Solution Surat.
How can I help you today?

User: laptop slow hai
Reply:
Laptop slow issue mostly low storage, old HDD, virus or RAM issue ki wajah se hota hai 😊
SSD upgrade and optimization se speed kaafi improve ho sakti hai.

User: gaming pc build
Reply:
Yes 😊 We also provide custom Gaming PC builds.
Budget aur usage bataiye, uske hisaab se best configuration suggest kar denge.

User: cctv installation
Reply:
Yes 👍 We provide CCTV installation for home, office and shops.
Indoor & outdoor camera setup available.

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

console.log(data);

let reply = 'Please WhatsApp us for more details 😊';

if (
  data &&
  data.candidates &&
  data.candidates.length > 0 &&
  data.candidates[0].content &&
  data.candidates[0].content.parts &&
  data.candidates[0].content.parts.length > 0
) {
  reply = data.candidates[0].content.parts[0].text;
}

res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({
      reply: 'Server busy right now 😊 Please try again or WhatsApp us.',
    });
  }
}
