from fastapi import FastAPI, UploadFile, File, Body
import requests
import uvicorn
import yaml
from utils import get_chatgpt_reponse  


with open("cadentials.yaml") as f:  
    credentials = yaml.load(f, Loader=yaml.FullLoader)

open_ai_api = credentials["OPEN_AI_KEY"]

app = FastAPI()

@app.post('/generate_response/')
async def get_response(response: str = Body(...)):
    prompt = f"Imagine that you are a virtual caretaker of an adult guy and respond and continue the conversation for his response.\nHis Response: {response}"
    chatgpt_response = get_chatgpt_reponse(prompt)
    return {"response": chatgpt_response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
