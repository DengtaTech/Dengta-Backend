from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List

import torch
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

app = FastAPI()
model = SentenceTransformer('DMetaSoul/Dmeta-embedding-zh')
model.to(device)

class TextData(BaseModel):
    sentences: List[str]

@app.post("/embed")
async def embed(data: TextData):
    try:
        embeddings = model.encode(data.sentences, convert_to_tensor=True, device=device)
        return {"embeddings": embeddings.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Milvus FastAPI!!!!"}

def start():
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5001)

if __name__ == '__main__':
    start()


