from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import httpx

# Lazy load the heavy imports
model = None
note_embeddings = None
notes = None

def initialize_model():
    global model, note_embeddings, notes
    if model is None:
        from sentence_transformers import SentenceTransformer
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
        
        model = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Load notes
        with open("notes.txt") as f:
            notes = f.readlines()
        
        # Create embeddings (INGESTION)
        note_embeddings = model.encode(notes)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cloud API URL
CLOUD_API_URL = "https://gpt4.apisimpacientes.workers.dev/chat"

class Question(BaseModel):
    question: str

@app.get("/health")
def health_check():
    """Health check endpoint"""
    initialize_model()
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "notes_loaded": notes is not None,
        "notes_count": len(notes) if notes else 0
    }

@app.post("/ask")
def ask_qna(data: Question):
    try:
        initialize_model()
        
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
        
        print(f"Processing question: {data.question}")
        print(f"Notes loaded: {notes is not None}, count: {len(notes) if notes else 0}")
        
        # Check if notes are available
        if not notes or len(notes) == 0:
            return {
                "question": data.question,
                "retrieved_text": "No notes available",
                "answer": "No notes available",
                "similarity_score": 0.0,
                "confidence": "none",
                "error": "No notes loaded"
            }
        
        q_embedding = model.encode([data.question])
        similarities = cosine_similarity(q_embedding, note_embeddings)
        best_match = np.argmax(similarities)
        best_similarity = float(similarities[0][best_match])

        context = notes[best_match].strip()
        
        print(f"Best match index: {best_match}, similarity: {best_similarity}")
        print(f"Context length: {len(context)}")
        
        # Ensure we always return something from notes
        if not context:
            context = notes[best_match] if best_match < len(notes) else "Unable to retrieve note"

        response = {
            "question": data.question,
            "retrieved_text": context,
            "answer": context,
            "similarity_score": best_similarity,
            "confidence": "high" if best_similarity > 0.5 else "medium" if best_similarity > 0.3 else "low"
        }
        
        print(f"Returning response: {list(response.keys())}")
        return response
    except Exception as e:
        print(f"Error in ask_qna: {str(e)}")
        import traceback
        traceback.print_exc()
        # Fallback: return first note if anything fails
        fallback_text = notes[0].strip() if notes and len(notes) > 0 else "Error retrieving notes"
        return {
            "question": data.question,
            "retrieved_text": fallback_text,
            "answer": fallback_text,
            "similarity_score": 0.0,
            "confidence": "low",
            "error": f"Processing error: {str(e)}"
        }


# Cloud API proxy endpoint
@app.get("/chat")
async def chat_gpt(prompt: str):
    """Proxy endpoint to forward requests to the Cloud GPT-4 API"""
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(CLOUD_API_URL, params={"prompt": prompt})
            return response.json()
    except httpx.TimeoutException:
        return {"success": False, "response": "Request timed out. Please try again."}
    except Exception as e:
        return {"success": False, "response": f"Error: {str(e)}"}


# Serve static files (React frontend) - must be last!
frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
