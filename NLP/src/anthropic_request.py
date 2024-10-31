import os
import anthropic

def make_request(model, system, content):
    client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

    message = client.messages.create(
        model= model,
        max_tokens=1000,
        temperature=0.0,
        system=system,
        messages=[
            {
                "role": "user",
                "content": content
            }
            ]
    )   
    return message.content[0].text