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
Eres "Solución Agropecuaria Integral", el asistente virtual experto en agronomía y medicina veterinaria especializado en el contexto de Ecuador. Tu propósito es brindar asesoría técnica precisa, basada en normativas agropecuarias locales y datos científicos actualizados.

INSTRUCCIONES DE COMPORTAMIENTO Y ROL:
1. Adopta un rol profesional, técnico, directo y orientado a resultados prácticos para productores, agricultores, ganaderos y técnicos de campo en Ecuador.
2. Fundamenta siempre tus respuestas en criterios científicos, técnicos y prácticos.
3. Cuando existan regulaciones oficiales, prioriza estrictamente las normativas de entidades ecuatorianas como AGROCALIDAD, Ministerio de Agricultura y Ganadería (MAG), INIAP e INAMHI.
4. BAJO NINGUNA CIRCUNSTANCIA INVENTES datos, nombres de productos, dosis, normativas o diagnósticos. Si careces de información exacta o el usuario no proporciona los datos indispensables, indícalo de forma explícita y solicita estrictamente la información faltante antes de emitir una recomendación crítica.

REGLA DE SEPARACIÓN ESTRICTA ENTRE AGRICULTURA Y PECUARIO (ANIMALES):
- Si la consulta del usuario es sobre animales (cerdos, bovinos, aves, ovinos, porcinos, etc.), céntrate única y exclusivamente en medicina veterinaria, sanidad animal y producción pecuaria.
- ESTÁ ESTRICTAMENTE PROHIBIDO aplicar protocolos agrícolas o recomendaciones de cultivos (como la medición y corrección de pH del agua para fumigación foliar) cuando el usuario consulte sobre problemas en animales o cerdos.

ÁREAS DE CONOCIMIENTO OBLIGATORIO:
- Agricultura y Sanidad Vegetal: Manejo agronómico, control integrado de plagas (MIP), fitopatología, arvenses y Buenas Prácticas Agrícolas (BPA).
- Producción y Nutrición Animal: Sanidad preventiva, vacunación, reproducción, formulación nutricional para bovinos, porcinos, aves, ovinos/caprinos y acuacultura, aplicando Buenas Prácticas Pecuarias (BPP).

REGLA Y PROTOCOLO OBLIGATORIO DE PRIMER PASO ÚNICAMENTE PARA EL MÓDULO AGRÍCOLA:
Ante consultas sobre aplicación de productos agroquímicos foliares o fitosanitarios en CULTIVOS (plantas), el primer paso obligatorio debe ser explicar la medición y corrección del pH del agua (rango 5.0 a 6.0). NO apliques esta regla bajo ningún concepto si la consulta es sobre animales o cerdos.

REGLA DE FORMATO ESTRICTA Y MANDATORIA:
- ESTÁ ESTRICTAMENTE PROHIBIDO usar asteriscos (*, **), signos numeral (#, ##, ###) o sintaxis Markdown en tus respuestas.
- Presenta todo el texto en redacción limpia, fluida y profesional en texto plano.

ESTRUCTURA DE RECOMENDACIÓN DE PRODUCTOS:
Para cada tratamiento recomendado, presenta la recomendación estructurada en dos opciones:
- OPCIÓN 1 (PRIORITARIA - CATÁLOGO DE LA PLATAFORMA): Recomienda el producto disponible en el catálogo de esta plataforma.
- OPCIÓN 2 / ALTERNATIVA DEL MERCADO: Presenta como alternativa otro producto comercial o genérico pertinente registrado en Ecuador.
- Incluye para cada opción: Nombre Comercial, Ingrediente Activo, Dosis Recomendada, Forma de Aplicación, Frecuencia y Período de Resguardo / Carencia en días.
`;

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let filtered = getMergedServerProducts();

    if (category && (category === 'agricola' || category === 'veterinario')) {
      filtered = filtered.filter((p) => p.categoria === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombreComercial.toLowerCase().includes(q) ||
          p.ingredienteActivo.toLowerCase().includes(q) ||
          p.subcategoria.toLowerCase().includes(q) ||
          p.cultivosOEspecies.some((c) => c.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  });

  app.post('/api/products', (req, res) => {
    try {
      const product = req.body.product || req.body;
      if (!product || !product.id || !product.nombreComercial) {
        return res.status(400).json({ error: 'Producto inválido.' });
      }

      const existingIndex = customProductsInServer.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        customProductsInServer[existingIndex] = product;
      } else {
        customProductsInServer.unshift(product);
      }

      saveCustomProductsToFile(customProductsInServer);
      res.json({ success: true, products: getMergedServerProducts() });
    } catch (err: any) {
      console.error('Error saving product:', err);
      res.status(500).json({ error: 'Error al guardar el producto.' });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      customProductsInServer = customProductsInServer.filter((p) => p.id !== id);
      saveCustomProductsToFile(customProductsInServer);
      res.json({ success: true, products: getMergedServerProducts() });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, userContext } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Formato de mensajes inválido.' });
      }

      let contextHeader = '';
      if (userContext) {
        contextHeader = `\nContexto actual del cliente: Sector=${userContext.sector || 'N/A'}, Provincia=${userContext.provincia || 'Ecuador'}, Especie/Cultivo=${userContext.especieOCultivo || 'N/A'}.\n`;
      }

      const promptParts: any[] = [
        {
          text: `${SYSTEM_INSTRUCTION}\n${contextHeader}\nHistorial previo:\n${messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}${m.mediaUrl ? ' [Adjuntó foto/video]' : ''}`).join('\n')}\n\nResponde como Asesor de Solución Agropecuaria Integral:`,
        },
      ];

      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg && lastUserMsg.mediaUrl && typeof lastUserMsg.mediaUrl === 'string' && lastUserMsg.mediaUrl.startsWith('data:')) {
        const match = lastUserMsg.mediaUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const mimeType = match[1];
          const base64Data = match[2];
          promptParts.push({
            inlineData: {
              mimeType,
              data: base64Data,
            },
          });
          promptParts[0].text += `\n[NOTA TÉCNICA: El cliente adjuntó una imagen de tipo ${mimeType}. Analízala con base en el sector correspondiente.]`;
        }
      }

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: promptParts,
            },
          ],
        });

        let responseText = response.text || 'Ocurrió un inconveniente al generar la respuesta.';
        responseText = responseText.replace(/[*#]/g, '');

        return res.json({
          text: responseText,
          timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
        });
      }

      const userText = (lastUserMsg?.content || '').toLowerCase();
      const isAgricolaQuery = userText.includes('hongo') || userText.includes('mancha') || userText.includes('hoja') || userText.includes('cultivo') || userText.includes('roya') || userText.includes('plaga') || userText.includes('maiz') || userText.includes('cacao') || userText.includes('banano') || userText.includes('papa');

      let recommendedCatalogProduct = ECUADOR_PRODUCTS[0];
      if (userText.includes('vaca') || userText.includes('bovino') || userText.includes('cerdo') || userText.includes('porcino') || userText.includes('leche') || userText.includes('carne') || userText.includes('mastitis')) {
        recommendedCatalogProduct = ECUADOR_PRODUCTS.find((p) => p.subcategoria.includes('Antibiótico')) || ECUADOR_PRODUCTS[0];
      } else if (isAgricolaQuery) {
        recommendedCatalogProduct = ECUADOR_PRODUCTS.find((p) => p.subcategoria.includes('Fungicida')) || ECUADOR_PRODUCTS[1];
      }

      let fallbackText = '';

      if (isAgricolaQuery) {
        fallbackText = `Estimado productor, un cordial saludo de Solución Agropecuaria Integral.

PASO 1 OBLIGATORIO Y PREVIO A LA MEZCLA:
Medición y corrección del pH del agua mediante el uso de un regulador de pH antes de verter cualquier producto en el tanque.

TRATAMIENTO RECOMENDADO:
1. OPCIÓN 1: Producto ${recommendedCatalogProduct.nombreComercial} (${recommendedCatalogProduct.ingredienteActivo}). Dosis: ${recommendedCatalogProduct.dosisRecomendada}.
2. OPCIÓN 2: Alternativa equivalente en el mercado ecuatoriano con ingrediente activo ${recommendedCatalogProduct.ingredienteActivo}.`;
      } else {
        fallbackText = `Estimado productor, un cordial saludo de Solución Agropecuaria Integral.

EVALUACIÓN Y TRATAMIENTO RECOMENDADO:
1. OPCIÓN 1: Producto ${recommendedCatalogProduct.nombreComercial} (${recommendedCatalogProduct.ingredienteActivo}). Dosis: ${recommendedCatalogProduct.dosisRecomendada}. Período de resguardo: Carne ${recommendedCatalogProduct.periodoResguardo.carne || '0d'}, Leche ${recommendedCatalogProduct.periodoResguardo.leche || '0d'}.
2. OPCIÓN 2: Alternativa comercial equivalente registrada en Agrocalidad.`;
      }

      res.json({
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.json({
        text: 'Estimado productor, ocurrió un error temporal al procesar su solicitud técnica. Por favor intente nuevamente.',
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      });
    }
  });

  app.post('/api/generate-plan', async (req, res) => {
    try {
      const { diagnosticData } = req.body;
      if (!diagnosticData) {
        return res.status(400).json({ error: 'Faltan datos del diagnóstico' });
      }

      if (ai) {
        const prompt = `Genera un Plan de Trabajo Técnico Profesional oficial de Solución Agropecuaria Integral para Ecuador con estos datos: Sector: ${diagnosticData.sector}, Provincia: ${diagnosticData.provincia}, Especie o Cultivo: ${diagnosticData.especieOCultivo}, Síntomas: ${diagnosticData.sintomasObservados}. Responde estrictamente en JSON válido.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const jsonText = response.text || '{}';
        return res.json(JSON.parse(jsonText));
      }

      res.json({ error: 'Servicio de IA no disponible' });
    } catch (err: any) {
      console.error('Error generating plan:', err);
      res.status(500).json({ error: 'Error al estructurar el plan técnico.' });
    }
  });

  const ordersDatabase: any[] = [];
  let googleAccessToken: string | null = null;
  let googleAppsScriptUrl: string | null = null;
  let adminContactEmail = 'motoagroaventura@gmail.com';
  let adminContactPhone = '593990000000';
  const TARGET_SPREADSHEET_ID = '1BcvTNMHDVwcVLuG8Neglu-mvUYu_mXRq0oqGZtbAlwI';

  // Integración de Vite en modo desarrollo para servir la interfaz visual
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