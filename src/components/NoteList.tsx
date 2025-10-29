import { Note } from '../db';
import NoteCard from './NoteCard';
import { SearchResult } from '../lib/embeddings';

interface NoteListProps {
  notes: Note[] | SearchResult[];
  onRefresh: () => void;
}

export default function NoteList({ notes, onRefresh }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Nessuna nota trovata</p>
        <p className="text-sm mt-2">Inizia creando la tua prima nota!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onRefresh}
          similarity={'similarity' in note ? note.similarity : undefined}
        />
      ))}
    </div>
  );
}
