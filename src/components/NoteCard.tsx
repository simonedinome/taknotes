import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Trash2, Tag, Smile, Frown, Meh } from 'lucide-react';
import { Note } from '../db';
import { deleteNote } from '../lib/storage';

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
  similarity?: number;
}

const sentimentIcons = {
  positive: <Smile className="w-4 h-4 text-green-500" />,
  negative: <Frown className="w-4 h-4 text-red-500" />,
  neutral: <Meh className="w-4 h-4 text-gray-500" />
};

const categoryColors: Record<string, string> = {
  Lavoro: 'bg-blue-100 text-blue-800',
  Personale: 'bg-purple-100 text-purple-800',
  Idee: 'bg-yellow-100 text-yellow-800',
  Todo: 'bg-green-100 text-green-800',
  Riflessioni: 'bg-pink-100 text-pink-800',
  Progetti: 'bg-indigo-100 text-indigo-800'
};

export default function NoteCard({ note, onDelete, similarity }: NoteCardProps) {
  const handleDelete = async () => {
    if (confirm('Sei sicuro di voler eliminare questa nota?')) {
      try {
        await deleteNote(note.id!);
        onDelete();
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {note.category && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[note.category] || 'bg-gray-100 text-gray-800'}`}>
              {note.category}
            </span>
          )}
          {note.sentiment && (
            <span className="flex items-center gap-1">
              {sentimentIcons[note.sentiment]}
            </span>
          )}
          {similarity !== undefined && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
              {(similarity * 100).toFixed(0)}% match
            </span>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          title="Elimina nota"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-gray-800 mb-3 whitespace-pre-wrap">{note.text}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2 flex-wrap">
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>{note.tags.join(', ')}</span>
            </div>
          )}
        </div>
        <time dateTime={new Date(note.timestamp).toISOString()}>
          {format(note.timestamp, 'dd MMM yyyy, HH:mm', { locale: it })}
        </time>
      </div>
    </div>
  );
}
