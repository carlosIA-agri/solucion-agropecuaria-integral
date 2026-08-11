import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { ECUADOR_PRODUCTS } from './src/data/ecuadorProducts';
import dotenv from 'dotenv';

dotenv.config();

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'custom_products.json');

function loadCustomProductsFromFile(): any[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE_PATH)) {
      const data = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading custom_products.json:', err);
  }
  return [];
}

function saveCustomProductsToFile(customProds: any[]) {
  try {
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(customProds, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing custom_products.json:', err);
  }
}

let customProductsInServer: any[] = loadCustomProductsFromFile();

function getMergedServerProducts(): any[] {
  const customIds = new Set(customProductsInServer.map((p) => p.id));
  const baseFiltered = ECUADOR_PRODUCTS.filter((p) => !customIds.has(p.id));
  return [...customProductsInServer, ...baseFiltered];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  const SYSTEM_INSTRUCTION = `
Eres "Solución Agropecuaria Integral", el asistente virtual experto en agronomía y medicina veterinaria especializado en el contexto de Ecuador.

REGLAS DE FORMATO:
- ESTÁ ESTRICTAMENTE PROHIBIDO usar asteriscos (*, **), signos numeral (#, ##, ###) o sintaxis Markdown.
- Usa redacción limpia, fluida y profesional en texto plano.
`;

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: `${SYSTEM_INSTRUCTION}\n\nConsulta del productor: ${lastUserMsg}`,
        });

        let responseText = response.text || 'Ocurrió un inconveniente al generar la respuesta.';
        responseText = responseText.replace(/[*#]/g, '');

        return res.json({ text: responseText, timestamp: new Date().toLocaleTimeString('es-EC') });
      }

      res.json({ text: 'Servicio de IA temporalmente no disponible.', timestamp: new Date().toLocaleTimeString('es-EC') });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.json({ text: 'Error temporal al procesar su solicitud. Intente nuevamente.', timestamp: new Date().toLocaleTimeString('es-EC') });
    }
  });

  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { diagnosticData } = req.body;
      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: `Genera un plan técnico para ${diagnosticData.especieOCultivo}. Responde solo en JSON.`,
          config: { responseMimeType: 'application/json' },
        });
        return res.json(JSON.parse(response.text || '{}'));
      }
      res.json({ error: 'IA no disponible' });
    } catch (err: any) {
      res.status(500).json({ error: 'Error al estructurar el plan.' });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();