import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { createNote } from '../lib/storage';
import { analyzeNote } from '../lib/ai';

interface NoteFormProps {
  onNoteCreated: () => void;
}

export default function NoteForm({ onNoteCreated }: NoteFormProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Analyze note with AI
      const { analysis, embedding } = await analyzeNote(text);

      // Save to database
      await createNote({
        text: text.trim(),
        timestamp: Date.now(),
        category: analysis.category,
        tags: analysis.tags,
        sentiment: analysis.sentiment,
        embedding
      });

      setText('');
      onNoteCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      console.error('Error creating note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Scrivi una nuova nota
          </label>
          <textarea
            id="note"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="La tua nota..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analisi in corso...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Salva nota
            </>
          )}
        </button>
      </form>
    </div>
  );
}
