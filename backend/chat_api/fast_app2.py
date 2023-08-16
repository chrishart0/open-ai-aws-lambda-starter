from fastapi import FastAPI, HTTPException, Body
from typing import List, Dict, Any, Union
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()


class Message(BaseModel):
    role: str
    content: str

# class Messages(BaseModel):
#     message: List[Message]

class Messages(BaseModel):
    message: List[Dict]

@app.post("/chat")
async def get_body(messages: Messages):

    # Simple logic to ensure the request is correct and to provide a basic response
    if not messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    # For the sake of demonstration, this logic simply returns the last message.
    last_message = messages[-1].content
    response = {
        "role": "assistant",
        "content": f"You sent: {last_message}. How can I help further?"
    }

    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
