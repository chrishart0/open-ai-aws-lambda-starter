from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, PlainTextResponse
from typing import List
from pydantic import BaseModel

# Import necessary functions from the app module
from app import get_openai_api_key, call_openai_api, get_logger

# Initialize a logger
logger = get_logger()

# Instantiate FastAPI app
logger.info("Initializing FastAPI application")
app = FastAPI()

# Add CORS middleware for API to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://mydomain.com",
        # Add other origins you want to allow
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Message and ChatPayload models for API request validation
class Message(BaseModel):
    role: str
    content: str

class ChatPayload(BaseModel):
    message: List[Message]

# Exception handler for HTTP errors with enhanced logging
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"Error occurred: {exc.detail}")
    logger.error(f"Request body: {await request.body()}")
    return JSONResponse(content={"detail": exc.detail}, status_code=exc.status_code)

# Exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation Error occurred: {exc.errors()}")
    logger.error(f"Request body: {await request.body()}")
    return PlainTextResponse(str(exc), status_code=400)

# Define chat endpoint to interact with the OpenAI API
@app.post("/chat")
async def get_body(payload: ChatPayload):

    # Get OpenAI API key
    logger.info("Getting OpenAI API key from AWS Secrets Manager")
    open_ai_api_key = get_openai_api_key()

    # Extract chat history from payload
    chat_history = [message.dict() for message in payload.message]
    
    logger.info("Chat Endpoint called")
    logger.info("Chat History: %s", chat_history)

    # Call OpenAI API and get response
    latest_response, tokens_used = call_openai_api(chat_history, open_ai_api_key)
    chat_history.append(latest_response.to_dict())

    # Return the response
    return {
        "tokens_used": tokens_used,
        "message": chat_history,
    }


# Main execution block: Starts the FastAPI app using Uvicorn
if __name__ == "__main__":
    import uvicorn

    # Get OpenAI API key
    # logger.info("Getting OpenAI API key from AWS Secrets Manager")
    # open_ai_api_key = get_openai_api_key()

    # Run the FastAPI app on the specified host and port
    uvicorn.run(app, host="0.0.0.0", port=4000)
