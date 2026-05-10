export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      reply: 'Method not allowed'
    });
  }

  try {

    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const message = body.message || '';

    const systemPrompt = `
You are Assistant Ayesha, smart AI assistant of Computer Solution Surat.

Business Services:

Business Information:
- Business Name: Computer Solution Surat
- Mobile Number: +91 7878787858
- WhatsApp Number: +91 7878787858
- Location: Surat, Gujarat, India
- Office Address: Ground Floor,Krishna Nagar Society,Opp.Chowksiwadi,Adajan,Surat 395009
- Owner Name: Rehan Pothiawala
- Website: https://computersolutionsurat.com

Important Rules:
- Always provide the exact mobile number above.
- Never create or guess any other phone number.
- Always provide the exact office address above.
- Always provide the exact owner name above.
- Never create fake owner names.
- Never create fake addresses.
- If user asks for contact details, provide only the information above.
- Laptop Repair
- Computer Repair
- Gaming PC Build
- CCTV Installation
- Printer Repair
- Windows Installation
- SSD Upgrade
- Networking
- WiFi Support
- Data Recovery

Behavior Rules:
- Reply naturally like a real human assistant.
- Hindi + English mix allowed.
- Keep replies short and useful.
- Maximum 4 short lines.
- Help users properly first.
- Suggest WhatsApp only when detailed checking or pricing is needed.
- Be friendly and professional.
- Answer only technology/computer related queries.

Examples:

User: hi
Reply:
Hello 👋
Welcome to Computer Solution Surat.
How can I help you today?

User: laptop slow hai
Reply:
Laptop slow issue mostly HDD, storage, RAM ya virus ki wajah se hota hai 😊
SSD upgrade se speed kaafi improve ho sakti hai.

User: gaming pc build
Reply:
Yes 😊 We provide custom Gaming PC builds.
Budget aur usage bataiye, uske hisaab se best configuration suggest kar denge.
`;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 120
        })
      }
    );

    const data = await response.json();

    console.log(JSON.stringify(data));

    let reply = 'Please try again 😊';

    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message
    ) {
      reply = data.choices[0].message.content;
    }

    return res.status(200).json({ reply });

  } catch (error) {

    console.log(error);

    return res.status(200).json({
      reply: 'Assistant temporarily busy 😊'
    });
  }
}
