import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userContext } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const systemInstruction = `Anda adalah Asisten AI Koperasi SPPS (Koperasi Syariah).
Tugas Anda adalah melayani dan membantu anggota Koperasi secara real-time terkait:
- Info saldo dan simpanan (Wadiah & Mudarabah).
- Informasi pembiayaan syariah (Murabahah, Ijarah, Musyarakah).
- Laporan dan simulasi margin keuntungan/nisbah bagi hasil.
- Memberikan panduan penggunaan aplikasi.

Jawablah dengan sopan, santun, hangat (seperti Customer Support profesional), dan bernuansa islami (misal: "Ahlan wa sahlan", "Insya Allah").
Anda memiliki akses ke data anggota secara real-time melalui konteks berikut. Jawablah sesuai dengan data user ini jika relevan. Jika ditanya informasi yang tidak ada di konteks, sampaikan bahwa Anda tidak dapat melihat info tersebut.

INFORMASI PENGGUNA SAAT INI:
${userContext}
`;
      
      const contents = (history || []).map((msg: any) => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Maaf, sistem asisten sedang gangguan. Kami sedang memperbaikinya, mohon coba kembali beberapa saat lagi." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
