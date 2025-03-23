from fastapi import FastAPI, UploadFile, File, Body
import requests
import uvicorn
import yaml
from utils import get_chatgpt_response  
from fastapi.middleware.cors import CORSMiddleware
from models import VoiceText

with open("cadentials.yaml") as f:  
    credentials = yaml.load(f, Loader=yaml.FullLoader)

open_ai_api = credentials["OPEN_AI_KEY"]




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including POST
    allow_headers=["*"],  # Allows all headers
)



@app.post('/generate_response/')
async def get_response(voiceText:VoiceText):
    prompt = f"Imagine that you are a virtual caretaker of an adult guy and respond and continue the conversation for his response.\nHis Response: {voiceText.message}"
    chatgpt_response = get_chatgpt_response(prompt)
    return {"reply": chatgpt_response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
