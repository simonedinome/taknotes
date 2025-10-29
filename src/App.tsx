import { useState, useEffect } from 'react';
import { BookText, Search as SearchIcon, MessageSquare, Shield } from 'lucide-react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import SearchBar from './components/SearchBar';
import ChatInterface from './components/ChatInterface';
import PrivacyDashboard from './components/PrivacyDashboard';
import { getAllNotes } from './lib/storage';
import { Note } from './db';
import { SearchResult } from './lib/embeddings';

type View = 'notes' | 'search' | 'chat' | 'privacy';

function App() {
  const [currentView, setCurrentView] = useState<View>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const allNotes = await getAllNotes();
      setNotes(allNotes);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleNoteCreated = () => {
    loadNotes();
  };

  const handleSearchResults = (results: SearchResult[] | null) => {
    setSearchResults(results);
  };

  const navItems = [
    { id: 'notes' as View, icon: BookText, label: 'Note' },
    { id: 'search' as View, icon: SearchIcon, label: 'Ricerca' },
    { id: 'chat' as View, icon: MessageSquare, label: 'Chat' },
    { id: 'privacy' as View, icon: Shield, label: 'Privacy' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TakNotes</h1>
                <p className="text-xs text-gray-500">Privacy-first AI note-taking</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'notes' && (
          <div className="space-y-6">
            <NoteForm onNoteCreated={handleNoteCreated} />
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                Caricamento note...
              </div>
            ) : (
              <NoteList notes={notes} onRefresh={loadNotes} />
            )}
          </div>
        )}

        {currentView === 'search' && (
          <div className="space-y-6">
            <SearchBar onResults={handleSearchResults} />
            {searchResults !== null && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Risultati della ricerca ({searchResults.length})
                </h2>
                <NoteList notes={searchResults} onRefresh={loadNotes} />
              </div>
            )}
          </div>
        )}

        {currentView === 'chat' && <ChatInterface />}

        {currentView === 'privacy' && <PrivacyDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            TakNotes - Tutti i dati sono memorizzati localmente nel tuo browser
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
