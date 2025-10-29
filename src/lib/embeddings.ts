import { Note } from '../db';
import { generateEmbedding } from './ai';

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export interface SearchResult extends Note {
  similarity: number;
}

export async function semanticSearch(
  query: string,
  notes: Note[],
  limit: number = 5,
  threshold: number = 0.3
): Promise<SearchResult[]> {
  // Filter notes that have embeddings
  const notesWithEmbeddings = notes.filter(note => note.embedding && note.embedding.length > 0);

  if (notesWithEmbeddings.length === 0) {
    return [];
  }

  const queryEmbedding = await generateEmbedding(query);

  const results = notesWithEmbeddings
    .map(note => ({
      ...note,
      similarity: cosineSimilarity(queryEmbedding, note.embedding!)
    }))
    .filter(note => note.similarity > threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
}

export async function findSimilarNotes(
  note: Note,
  allNotes: Note[],
  limit: number = 5
): Promise<SearchResult[]> {
  if (!note.embedding) {
    return [];
  }

  const results = allNotes
    .filter(n => n.id !== note.id && n.embedding)
    .map(n => ({
      ...n,
      similarity: cosineSimilarity(note.embedding!, n.embedding!)
    }))
    .filter(n => n.similarity > 0.5)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return results;
}
