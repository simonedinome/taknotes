import { useState } from 'react';
import { Download, Upload, Shield, Database, AlertCircle } from 'lucide-react';
import { getAllNotes } from '../lib/storage';
import { exportNotes, importNotes } from '../lib/storage';
import { db } from '../db';

export default function PrivacyDashboard() {
  const [stats, setStats] = useState({ totalNotes: 0, storageSize: 0 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadStats = async () => {
    const notes = await getAllNotes();
    const totalNotes = notes.length;

    // Estimate storage size (rough approximation)
    const dataSize = JSON.stringify(notes).length;
    const storageSize = Math.round(dataSize / 1024); // KB

    setStats({ totalNotes, storageSize });
  };

  useState(() => {
    loadStats();
  });

  const handleExport = async () => {
    try {
      const data = await exportNotes();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taknotes-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('Note esportate con successo!');
      setError('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'esportazione');
      console.error('Export error:', err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importNotes(text);
      await loadStats();

      setMessage('Note importate con successo!');
      setError('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'importazione');
      console.error('Import error:', err);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Sei sicuro di voler eliminare TUTTI i dati? Questa azione è irreversibile!')) {
      return;
    }

    try {
      await db.notes.clear();
      await loadStats();

      setMessage('Tutti i dati sono stati eliminati');
      setError('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'eliminazione');
      console.error('Clear error:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Privacy & Dati</h2>
          <p className="text-sm text-gray-600">Gestisci i tuoi dati personali</p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Note totali</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.totalNotes}</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 text-purple-700 mb-1">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Spazio utilizzato</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.storageSize} KB</p>
        </div>
      </div>

      {/* Privacy Info */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Privacy-First</p>
            <p>
              Tutti i tuoi dati sono memorizzati localmente nel tuo browser (IndexedDB).
              Le richieste all'API OpenAI vengono effettuate direttamente dal browser.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          Esporta note (JSON)
        </button>

        <label className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          Importa note
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        <button
          onClick={handleClearData}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
        >
          <AlertCircle className="w-5 h-5" />
          Elimina tutti i dati
        </button>
      </div>
    </div>
  );
}
