from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend import iris_connection
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import io

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
            file_blob BLOB,
            embedding VECTOR
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
    return embeddings.mean(axis=0).tolist()  # Average of chunk embeddings

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    course: str = Form(...)
):
    print("Uploading file:", file.filename)
    """Updated endpoint with embedding generation"""
    try:
        file_bytes = await file.read()
        
        # Process different file types
        if file.filename.lower().endswith('.pdf'):
            print("Processing PDF file")
            embedding = process_pdf(file_bytes)
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
                "INSERT INTO CourseMaterials (course, file_name, file_blob, embedding) VALUES (?, ?, ?, ?)",
                [course, file.filename, file_bytes, embedding]
            )
            conn.commit()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
