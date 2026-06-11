const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const PDF_TEXT_LIMIT = 80000;
const pdfParse = require("pdf-parse");

const TECHNICAL_FIELDS = [
  "acervo",
  "cat",
  "quantitativos",
  "atestados",
  "certificacoes",
  "creaCau",
  "equipeMinima",
  "observacoes",
];

function normalizeFields(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};

  return Object.fromEntries(
    TECHNICAL_FIELDS.map((field) => [field, typeof source[field] === "string" ? source[field].trim() : ""]),
  );
}

async function readJsonBody(request) {
  if (typeof request.body === "string") {
    const rawBody = request.body.trim();
    return rawBody ? JSON.parse(rawBody) : {};
  }

  if (Buffer.isBuffer(request.body)) {
    const rawBody = request.body.toString("utf8").trim();
    return rawBody ? JSON.parse(rawBody) : {};
  }

  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  return rawBody ? JSON.parse(rawBody) : {};
}

function normalizePdfBase64(value) {
  return String(value || "")
    .replace(/^data:application\/pdf;base64,/i, "")
    .replace(/\s/g, "")
    .trim();
}

function extractJsonPayload(text) {
  const clean = String(text || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) return clean;
  return clean.slice(start, end + 1);
}

async function extractPdfText(pdfBase64) {
  try {
    const buffer = Buffer.from(pdfBase64, "base64");
    const data = await pdfParse(buffer);
    const text = String(data?.text || "").trim();

    if (!text) throw new Error("empty_pdf_text");

    // Corte de segurança para evitar estourar o contexto da IA em editais muito longos.
    return text.slice(0, PDF_TEXT_LIMIT);
  } catch (error) {
    const wrappedError = new Error("Não foi possível extrair texto do PDF (pode ser um PDF escaneado).");
    wrappedError.cause = error;
    throw wrappedError;
  }
}

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Metodo nao permitido." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ ok: false, error: "Chave da Anthropic nao configurada." });
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    return response.status(400).json({ ok: false, error: "JSON invalido." });
  }

  const pdfBase64 = normalizePdfBase64(body?.pdfBase64);
  if (!pdfBase64) {
    return response.status(400).json({ ok: false, error: "PDF nao informado." });
  }

  let textoEdital;
  try {
    textoEdital = await extractPdfText(pdfBase64);
  } catch (error) {
    return response.status(422).json({
      ok: false,
      error: error.message,
    });
  }

  const prompt = `
Voce e um especialista em licitacoes de obras de saneamento basico no Brasil.

Leia o texto do edital abaixo e extraia apenas as exigencias de qualificacao tecnica.

Responda somente com JSON valido, sem comentarios, sem markdown e sem texto adicional.
Use exatamente esta estrutura:
{
  "acervo": "",
  "cat": "",
  "quantitativos": "",
  "atestados": "",
  "certificacoes": "",
  "creaCau": "",
  "equipeMinima": "",
  "observacoes": ""
}

Regras:
- Se uma informacao nao estiver clara no edital, deixe o campo vazio.
- Nao invente exigencias.
- Use portugues brasileiro.
- Resuma com objetividade, mantendo numeros, percentuais, unidades e prazos importantes quando existirem.

Texto do edital:
${textoEdital}
`.trim();

  try {
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await anthropicResponse.json().catch(() => ({}));

    if (!anthropicResponse.ok) {
      const detail = data?.error?.message || `Anthropic respondeu ${anthropicResponse.status}.`;
      return response.status(502).json({ ok: false, error: detail });
    }

    const text = data?.content?.find((item) => item?.type === "text")?.text || data?.content?.[0]?.text || "";
    let parsed;

    try {
      parsed = JSON.parse(extractJsonPayload(text));
    } catch {
      return response.status(502).json({ ok: false, error: "A IA retornou uma resposta fora do formato esperado." });
    }

    return response.status(200).json({ ok: true, fields: normalizeFields(parsed) });
  } catch (error) {
    return response.status(503).json({
      ok: false,
      error: "Nao foi possivel analisar o edital neste momento.",
      detail: String(error?.message || error),
    });
  }
};

module.exports.config = {
  maxDuration: 60,
};
