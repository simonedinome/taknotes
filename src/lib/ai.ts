import OpenAI from 'openai';
import { Note } from '../db';

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo per MVP
});

interface AnalysisResult {
  category: string;
  tags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export async function categorizeNote(text: string): Promise<AnalysisResult> {
  const prompt = `Analizza questa nota e fornisci un JSON con la categorizzazione.

ISTRUZIONI:
- category: scegli LA CATEGORIA PIÙ APPROPRIATA tra: Lavoro, Personale, Idee, Todo, Riflessioni, Progetti
  * "Idee" per nuove idee, brainstorming, concetti creativi
  * "Progetti" per progetti concreti o pianificazione
  * "Lavoro" per attività lavorative
  * "Todo" per liste di cose da fare
  * "Riflessioni" per pensieri personali, journaling
  * "Personale" per vita privata, famiglia, amici

- tags: estrai 2-5 PAROLE CHIAVE SIGNIFICATIVE che rappresentano i concetti principali
  * Usa sostantivi e termini tecnici rilevanti
  * Evita parole comuni (avuto, nuovo, ecc.)
  * Preferisci termini specifici e significativi
  * Esempi: "AI", "machine-learning", "progetto", "meeting", "deadline"

- sentiment: analizza il tono emotivo (positive, negative, neutral)

FORMATO:
{
  "category": "Idee|Progetti|Lavoro|Todo|Riflessioni|Personale",
  "tags": ["parola-chiave-1", "parola-chiave-2", "parola-chiave-3"],
  "sentiment": "positive|negative|neutral"
}

NOTA: "${text}"`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });

  return response.data[0].embedding;
}

export async function chatWithNotes(
  query: string,
  relevantNotes: Note[]
): Promise<string> {
  const context = relevantNotes
    .map(note => `[${note.category || 'Uncategorized'}] ${note.text}`)
    .join('\n\n');

  const messages = [
    {
      role: 'system' as const,
      content: 'Sei un assistente AI che aiuta gli utenti a recuperare informazioni dalle loro note personali. Rispondi in italiano in modo naturale e utile.'
    },
    {
      role: 'user' as const,
      content: `Basandoti su queste note:\n\n${context}\n\nRispondi alla seguente domanda: ${query}`
    }
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages
  });

  return response.choices[0].message.content || 'Non sono riuscito a generare una risposta.';
}

export async function analyzeNote(text: string): Promise<{
  analysis: AnalysisResult;
  embedding: number[];
}> {
  const [analysis, embedding] = await Promise.all([
    categorizeNote(text),
    generateEmbedding(text)
  ]);

  return { analysis, embedding };
}
