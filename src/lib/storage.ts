import { db, Note } from '../db';

export async function createNote(note: Omit<Note, 'id'>): Promise<number> {
  return await db.notes.add(note);
}

export async function getAllNotes(): Promise<Note[]> {
  return await db.notes.orderBy('timestamp').reverse().toArray();
}

export async function getNoteById(id: number): Promise<Note | undefined> {
  return await db.notes.get(id);
}

export async function updateNote(id: number, updates: Partial<Note>): Promise<void> {
  await db.notes.update(id, updates);
}

export async function deleteNote(id: number): Promise<void> {
  await db.notes.delete(id);
}

export async function searchNotes(query: string): Promise<Note[]> {
  const lowerQuery = query.toLowerCase();
  return await db.notes
    .filter(note =>
      note.text.toLowerCase().includes(lowerQuery) ||
      note.category?.toLowerCase().includes(lowerQuery) ||
      note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .toArray();
}

export async function getNotesByCategory(category: string): Promise<Note[]> {
  return await db.notes
    .where('category')
    .equals(category)
    .reverse()
    .sortBy('timestamp');
}

export async function getNotesBySentiment(sentiment: 'positive' | 'negative' | 'neutral'): Promise<Note[]> {
  return await db.notes
    .where('sentiment')
    .equals(sentiment)
    .reverse()
    .sortBy('timestamp');
}

export async function exportNotes(): Promise<string> {
  const notes = await getAllNotes();
  return JSON.stringify(notes, null, 2);
}

export async function importNotes(jsonData: string): Promise<void> {
  const notes = JSON.parse(jsonData) as Note[];
  await db.notes.bulkAdd(notes.map(({ id, ...note }) => note));
}
