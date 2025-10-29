import Dexie, { Table } from 'dexie';

export interface Note {
  id?: number;
  text: string;
  timestamp: number;
  category?: string;
  tags?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  embedding?: number[];
  metadata?: {
    location?: string;
    mood?: string;
  };
}

export class TakNotesDB extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('TakNotesDB');
    this.version(1).stores({
      notes: '++id, text, timestamp, category, sentiment'
    });
  }
}

export const db = new TakNotesDB();
