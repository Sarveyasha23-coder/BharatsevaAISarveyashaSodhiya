from fastapi import FastAPI
from pydantic import BaseModel
from agent import process_query

app = FastAPI()


class Query(BaseModel):
    text: str
    language: str = "hi"


@app.post("/voice-query")
async def voice_query(q: Query):
    result = process_query(q.text, q.language)
    return {"response": result}
