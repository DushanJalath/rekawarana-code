import openai
import yaml

# Load credentials from YAML file
with open("cadentials.yaml") as f:  # Corrected 'cadentials.yaml' to 'credentials.yaml'
    cadentials = yaml.load(f, Loader=yaml.FullLoader)

# Set the OpenAI API key
openai.api_key = cadentials["OPEN_AI_KEY"]

# Function to get a response from ChatGPT
def get_chatgpt_response(prompt: str):
    response = openai.ChatCompletion.create(  # Changed to ChatCompletion for GPT-3.5-turbo
        model="gpt-3.5-turbo",  # Correct model identifier
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.7,
    )

    # Return the content of the response
    return response.choices[0].message['content'].strip()  # Corrected method and access
