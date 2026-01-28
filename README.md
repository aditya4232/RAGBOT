🚀 What This Project Does

Takes a small text file (notes.txt)

Converts each line into embeddings

Accepts a user question via API

Finds the most relevant sentence

Returns it as the answer

👉 This project focuses on Retrieval, not text generation.

🧠 Key Concepts Covered

What is RAG (Retrieval-Augmented Generation)

Embeddings using all-MiniLM-L6-v2

Semantic search using cosine similarity

FastAPI backend

Simple API-based question answering

📂 Project Structure
RAGNOTES_search1/
├── app.py
├── notes.txt
├── requirements.txt
└── README.md

📝 Sample Input Data (notes.txt)
FastAPI is a Python web framework for building APIs.
It is fast and easy to use.
RAG stands for Retrieval Augmented Generation.
RAG combines search with language models.

⚙️ Tech Stack

Python 3.10+

FastAPI

Sentence-Transformers

scikit-learn

NumPy

Uvicorn

📦 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/Asha-ai/rag-notes-search.git
cd rag-notes-search

2️⃣ Install Dependencies
pip install -r requirements.txt

3️⃣ Run the Application
uvicorn app:app --reload

4️⃣ Open Swagger UI

Open your browser and go to:

http://127.0.0.1:8000/docs

🔍 How to Use the API
EndpointSample Request
{
  "question": "What is RAG?"
}

Sample Response
{
  "question": "What is RAG?",
  "retrieved_text": "RAG stands for Retrieval Augmented Generation.",
  "answer": "RAG stands for Retrieval Augmented Generation."
}

🧩 What Model Is Used?

Model: all-MiniLM-L6-v2

Purpose: Create embeddings for semantic similarity

Note: This is NOT a text generation model

⚠️ Limitations (Important for Beginners)

No LLM (OpenAI / Ollama) is used

Answers are returned only from provided notes

Cannot answer questions outside notes.txt
#Try these questions 
A. FastAPI-related (12 questions)

What is FastAPI?

Is FastAPI a Python framework?

What is FastAPI used for?

Which language is FastAPI built for?

Is FastAPI meant for APIs?

Is FastAPI slow or fast?

Is FastAPI easy to use?

Can FastAPI be used to build APIs?

Is FastAPI a web framework?

Is FastAPI complex to use?

What type of framework is FastAPI?

Is FastAPI related to backend development?

B. RAG-related (12 questions)

What does RAG stand for?

What is the full form of RAG?

Is RAG related to generation?

Does RAG use retrieval?

Does RAG combine search?

Is RAG related to language models?

What two things does RAG combine?

Is RAG only generation?

Is RAG only search?

Is RAG a combination approach?

Is RAG used in AI systems?

Does RAG use models?

C. Cross / Reasoning (6 questions)

Is FastAPI related to RAG?
➡️ Answer: No direct relation (not mentioned)

Are FastAPI and RAG the same thing?
➡️ No

Which one is a framework: FastAPI or RAG?
➡️ FastAPI

Which one combines search and models?
➡️ RAG

Is FastAPI part of RAG?
➡️ Not mentioned in the text

Are both FastAPI and RAG technical concepts?
➡️ Yes
POST /ask

Sample Request
