# TakNotes

Privacy-first, AI-powered note-taking application with local-first architecture.

## Features

- **AI-Powered Analysis**: Automatic categorization, tag extraction, and sentiment analysis using OpenAI GPT-4o-mini
- **Semantic Search**: Find notes using natural language queries with vector embeddings
- **RAG Chat Interface**: Ask questions about your notes and get contextual answers
- **Privacy-First**: All data stored locally in your browser (IndexedDB)
- **Export/Import**: Full control over your data with JSON export/import
- **Beautiful UI**: Clean, modern interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Database**: Dexie.js (IndexedDB wrapper)
- **AI**: OpenAI API (gpt-4o-mini, text-embedding-3-small)
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/          # React components
│   ├── NoteCard.tsx    # Individual note display
│   ├── NoteForm.tsx    # Note creation form
│   ├── NoteList.tsx    # List of notes
│   ├── SearchBar.tsx   # Semantic search interface
│   ├── ChatInterface.tsx    # RAG chat interface
│   └── PrivacyDashboard.tsx # Data management
├── lib/                # Core utilities
│   ├── ai.ts          # OpenAI service
│   ├── storage.ts     # Dexie operations
│   ├── embeddings.ts  # Vector search
│   └── encryption.ts  # Crypto utilities
├── db.ts              # Dexie schema
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Setup

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taknotes
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Development

Start the development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

### Creating Notes

1. Go to the **Note** tab
2. Type your note in the text area
3. Click **Salva nota** - the AI will automatically:
   - Categorize the note (Lavoro, Personale, Idee, Todo, Riflessioni, Progetti)
   - Extract relevant tags
   - Analyze sentiment (positive, negative, neutral)
   - Generate vector embeddings for semantic search

### Semantic Search

1. Go to the **Ricerca** tab
2. Enter a natural language query (e.g., "progetti di lavoro importanti")
3. The app will find semantically similar notes using AI embeddings
4. Results are ranked by similarity score

### Chat with Notes

1. Go to the **Chat** tab
2. Ask questions about your notes (e.g., "Quali idee ho avuto questa settimana?")
3. The AI will find relevant notes and provide contextual answers

### Privacy & Data Management

1. Go to the **Privacy** tab
2. View statistics about your data
3. Export notes as JSON for backup
4. Import previously exported notes
5. Clear all data if needed

## Privacy & Security

- **Local-First**: All notes are stored in your browser's IndexedDB
- **No Server**: The app runs entirely in your browser
- **Direct API Calls**: OpenAI API calls are made directly from your browser
- **Your Data**: Export and own your data at any time
- **Encryption Ready**: Web Crypto API utilities included for future encryption features

## Future Enhancements

- Local AI models (Ollama integration)
- End-to-end encryption
- Multi-device sync (P2P)
- Advanced filters and views
- Note linking and backlinks
- Rich text editor
- Mobile app (React Native)

## API Usage & Costs

This app uses OpenAI API which has usage costs:
- **gpt-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **text-embedding-3-small**: ~$0.02 per 1M tokens

Typical usage per note:
- Categorization: ~150 tokens
- Embedding: ~100 tokens
- Chat query: ~500-1000 tokens

**Estimated cost**: ~$0.001 per note (very affordable!)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [OpenAI](https://openai.com/)
- Icons by [Lucide](https://lucide.dev/)
- Database by [Dexie.js](https://dexie.org/)
