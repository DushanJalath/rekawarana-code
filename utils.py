import openai

def get_chatgpt_reponse(prompt:str):
    reponse=openai.Completion.create(
        engine="GPT-3.5-turbo",
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.7,
    )

    return reponse.choices[0].text_strip()


