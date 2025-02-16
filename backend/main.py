from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend import iris_connection
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import io
import numpy as np
from pydantic import BaseModel
import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv() 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model once at startup
model = SentenceTransformer('all-MiniLM-L6-v2')

class GenerateRequest(BaseModel):
    prompt: str

@app.on_event("startup")
async def startup_event():
    """Original table creation logic preserved"""
    try:
        conn = iris_connection.get_connection()
        cursor = conn.cursor()
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS CourseMaterials (
            id INT IDENTITY PRIMARY KEY,
            course VARCHAR(255),
            file_name VARCHAR(255),
            file_txt TEXT,
            embedding VECTOR(DOUBLE, 384)
        )
        """
        cursor.execute(create_table_sql)
        conn.commit()
        cursor.close()
        conn.close()
        print("IRIS connection established and table verified.")
    except Exception as e:
        print("Startup error:", e)

def process_pdf(file_bytes):
    """Extract text from PDF and generate embedding"""
    text = ""
    pdf = PdfReader(io.BytesIO(file_bytes))
    for page in pdf.pages:
        text += page.extract_text() or ""
    
    # Simple chunking - adjust as needed
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    embeddings = model.encode(chunks, normalize_embeddings=True)
    return [text,embeddings.mean(axis=0).tolist()]  # Average of chunk embeddings

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    course: str = Form(...)
):
    print("Uploading file:", file.filename)
    print("Course:", course)
    """Updated endpoint with embedding generation"""
    try:
        file_bytes = await file.read()
        
        # Process different file types
        if file.filename.lower().endswith('.pdf'):
            print("Processing PDF file")
            res = process_pdf(file_bytes)
            embedding = res[1]
            text = res[0]
            print("Text:", text)
        elif file.filename.lower().endswith('.mp4'):
            # Placeholder for video processing
            embedding = model.encode(["video placeholder"]).tolist()[0]
        else:
            return JSONResponse(
                {"status": "error", "message": f"Unsupported file type: {file.filename}"},
                status_code=400
            )

        # Store in IRIS with embedding
        conn = iris_connection.get_connection()
        cursor = conn.cursor()
        try:
            print("Inserting into IRIS")
            cursor.execute(
                "INSERT INTO CourseMaterials (course, file_name, file_txt, embedding) VALUES (?, ?, ?, TO_VECTOR(?))",
                [course, file.filename, text, str(embedding)]
            )
            conn.commit()
            print("Inserted into IRIS")

        finally:
            cursor.close()
            conn.close()

        return JSONResponse({
            "status": "success",
            "message": "File uploaded with embeddings",
            "embedding_size": len(embedding)
        })

    except Exception as e:
        return JSONResponse(
            {"status": "error", "message": str(e)},
            status_code=500
        )

@app.post("/generate")
async def generate_endpoint(request: GenerateRequest):
    searchPhrase = request.prompt
    searchVector = model.encode(searchPhrase, normalize_embeddings=True).tolist()
    
    search_vector_np = np.array(searchVector)

    courses = ["biology", "mathematics"]
    course_embeddings = {}

    for course in courses:
        embedding = model.encode(course, normalize_embeddings=True)
        course_embeddings[course] = np.array(embedding)

    similarities = {}

    for course, embedding in course_embeddings.items():
        similarity = np.dot(search_vector_np, embedding)
        similarities[course] = similarity

    real_course = max(similarities, key=similarities.get)

    sql = f"""
        SELECT TOP ? file_txt
        FROM CourseMaterials
        WHERE course = ?
        ORDER BY VECTOR_DOT_PRODUCT(embedding, TO_VECTOR(?, double, 384)) DESC
    """
    conn = iris_connection.get_connection()
    cursor = conn.cursor()
  
    cursor.execute(sql, [5, real_course, str(searchVector)])

   
    results = cursor.fetchall()

    
    api_key = os.getenv("MISTRAL_API_KEY")
    mistral_model= "mistral-large-latest"

    client = Mistral(api_key=api_key)

    # chat_response = client.chat.complete(
    #     model = mistral_model,
    #     messages = [
    #         {
    #             "role": "user",
    #             "content": f"Use the following relevant information to generate notes for the user on the topic: {searchPhrase} : {str(results)}",
    #         },
    #     ]
    # )

        
    
    return {"status": "success", "course": real_course, "message": "hi"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
