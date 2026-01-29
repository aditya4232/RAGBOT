# RAGBOT - RAG-Powered Chatbot with Confidence Scoring

A full-stack **Retrieval-Augmented Generation (RAG)** chatbot that performs semantic search over a knowledge base and displays match confidence with visual indicators.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![React](https://img.shields.io/badge/React-19.2-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## What This Project Does

1. **Takes a knowledge base** (`notes.txt`) containing text paragraphs
2. **Converts text to embeddings** using Sentence Transformers
3. **Accepts user questions** via a chat interface
4. **Finds the most relevant answer** using cosine similarity
5. **Displays confidence scores** with visual progress bars and color-coded badges

> This project focuses on **Retrieval**, not text generation. Answers come directly from the knowledge base.

---

## Features

| Feature | Description |
|---------|-------------|
| **Dual Mode** | Switch between Local RAG and Cloud GPT-4 API |
| **Semantic Search** | Uses embeddings to understand meaning, not just keywords |
| **Confidence Scoring** | Visual progress bar showing match percentage (0-100%) |
| **Color-Coded Badges** | Green (HIGH), Yellow (MEDIUM), Red (LOW) confidence |
| **Dark Theme UI** | Modern ChatGPT-style interface |
| **Responsive Design** | Works on desktop and mobile |

---

## Screenshots

```
┌────────────────────────────────────────────────────────────┐
│ Assistant            via Local RAG              10:30 AM   │
├────────────────────────────────────────────────────────────┤
│ ██████████████████████░░░░░░░░  78% Match                  │
├────────────────────────────────────────────────────────────┤
│ RAG combines the power of search engines with large        │
│ language models to deliver more accurate responses...      │
├────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐                                       │
│ │ Confidence: HIGH │                                       │
│ └──────────────────┘                                       │
└────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
RAGBOT/
├── app.py                      # FastAPI backend
├── notes.txt                   # Knowledge base (source documents)
├── requirements.txt            # Python dependencies
├── README.md                   # This file
└── frontend/
    ├── index.html              # HTML entry point
    ├── package.json            # npm dependencies
    ├── vite.config.js          # Vite configuration
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Main app component
        ├── App.css             # Styling (dark theme)
        ├── index.css           # Base styles
        └── components/
            ├── ModeSwitch.jsx      # Local/Cloud toggle
            ├── ChatMessage.jsx     # Message with progress bar
            ├── ChatInput.jsx       # Text input form
            └── TypingIndicator.jsx # Loading animation
```

---

## Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** - Modern web framework for APIs
- **Sentence-Transformers** - Embedding model (`all-MiniLM-L6-v2`)
- **scikit-learn** - Cosine similarity calculation
- **NumPy** - Numerical operations
- **Uvicorn** - ASGI server
- **httpx** - Async HTTP client for Cloud API proxy

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool
- **CSS Variables** - Dark theme styling

---

## Installation & Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ragbot.git
cd ragbot
```

### 2. Set Up Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Set Up Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Run the Application
```bash
uvicorn app:app --reload
```

### 5. Open in Browser
```
http://127.0.0.1:8000
```

---

## API Endpoints

### `POST /ask` - Local RAG Search
Query the local knowledge base using semantic search.

**Request:**
```json
{
  "question": "What is RAG?"
}
```

**Response:**
```json
{
  "question": "What is RAG?",
  "answer": "RAG combines the power of search engines with large language models...",
  "retrieved_text": "RAG combines the power of search engines...",
  "similarity_score": 0.78,
  "confidence": "high"
}
```

### `GET /chat?prompt=...` - Cloud API Proxy
Forward requests to external GPT-4 API.

### `GET /health` - Health Check
Check model and data loading status.

---

## How RAG Works

```
USER QUESTION                    KNOWLEDGE BASE (notes.txt)
     │                                    │
     ▼                                    ▼
┌─────────────┐                  ┌─────────────────┐
│   Encode    │                  │  Pre-computed   │
│  Question   │                  │   Embeddings    │
│  (384-dim)  │                  │   (384-dim)     │
└──────┬──────┘                  └────────┬────────┘
       │                                  │
       └──────────────┬───────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │    Cosine     │
              │  Similarity   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  Best Match   │
              │  + Confidence │
              └───────────────┘
```

### Confidence Thresholds

| Score Range | Confidence | Color |
|-------------|------------|-------|
| > 0.5 | HIGH | Green |
| 0.3 - 0.5 | MEDIUM | Yellow |
| < 0.3 | LOW | Red |

---

## Key Concepts

### What is RAG?
**Retrieval-Augmented Generation** combines search (retrieval) with language models. Instead of generating answers from scratch, it first finds relevant documents, then uses them as context.

### What are Embeddings?
Embeddings convert text into numerical vectors (384 numbers) that capture semantic meaning. Similar texts have similar vectors.

### What is Cosine Similarity?
A metric that measures the angle between two vectors. Score ranges from 0 (completely different) to 1 (identical meaning).

---

## Sample Questions to Try

### FastAPI-related
- What is FastAPI?
- Is FastAPI a Python framework?
- What is FastAPI used for?

### RAG-related
- What does RAG stand for?
- Does RAG combine search?
- What two things does RAG combine?

### Semantic Search
- How does semantic search work?
- What are vector embeddings?

---

## Recent Changes

### v1.1.0 - Confidence Scoring Feature
- Added visual progress bar showing match percentage
- Added color-coded confidence badges (HIGH/MEDIUM/LOW)
- Cleaned up unused imports in backend
- Added UTF-8 encoding for file reading
- Improved note filtering (removes empty lines)

### Files Modified
| File | Changes |
|------|---------|
| `app.py` | Removed unused imports, added UTF-8 encoding |
| `App.jsx` | Added `similarityScore` extraction and passing |
| `ChatMessage.jsx` | Added progress bar and confidence badge |
| `App.css` | Added 75 lines of styling for new UI elements |
| `ModeSwitch.jsx` | Removed unused import |

---

## Limitations

- No LLM (OpenAI/Ollama) used for generation
- Answers come only from `notes.txt`
- Cannot answer questions outside the knowledge base
- Single best match (no multi-document retrieval)

---

## Future Improvements

- [ ] Support multiple file formats (PDF, DOCX)
- [ ] Show top-k results instead of just best match
- [ ] Add document upload feature
- [ ] Implement chat history persistence
- [ ] Add user authentication

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Developers/collaborator

**Aditya** , **Yashasvi** , **Sushik** , **Deepak** , **SriKrishna**

---

## Acknowledgments

- [Sentence Transformers](https://www.sbert.net/) for the embedding model
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://react.dev/) for the frontend framework
