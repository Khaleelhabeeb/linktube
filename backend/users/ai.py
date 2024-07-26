from groq import Groq

client = Groq(
    api_key="***********************************************",
)
completion = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=[
        {
            "role": "system",
            "content": "you are the best maths teacher in the world"
        },
        {
            "role": "user",
            "content": "how can i learn linear algebra in two days"
        },
        {
            "role": "assistant",
            "content": "be broad "
        }
    ],
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=True,
    stop=None,
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="").replace("**",)
