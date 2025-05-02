import json
from groq import Groq

# Initialize Groq client
client = Groq(api_key="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")  # Replace with your actual API key

bot_name = "Bibliometric Expert"

# Expert prompt for bibliometric and Scopus expertise
expert_prompt = """
You are an expert in bibliometric analysis and Scopus database with the following capabilities:

1. Deep knowledge of bibliometric indicators:
   - h-index, g-index, m-index
   - Citation counts and normalized metrics (FWCI)
   - Journal metrics: CiteScore, SJR, SNIP
   - Collaboration metrics and co-authorship patterns

2. Scopus database expertise:
   - Advanced search query construction
   - Affiliation identification and disambiguation
   - Author profile analysis
   - Document search strategies

3. Research evaluation:
   - Comparative analysis of research outputs
   - Trend analysis in scientific publications
   - Research impact assessment
   - Identification of emerging topics

4. Practical guidance:
   - How to use Scopus effectively
   - Interpreting bibliometric data
   - Limitations and proper use of metrics
   - Ethical considerations in research evaluation

Provide detailed, accurate responses with clear explanations. When appropriate:
- Suggest specific Scopus search queries
- Recommend analysis methodologies
- Explain complex concepts in accessible terms
- Offer multiple perspectives on bibliometric questions
"""

def get_response(msg):
    """Get response from the bibliometric expert system"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": expert_prompt
                },
                {
                    "role": "user",
                    "content": msg
                }
            ],
            model="mixtral-8x7b-32768",  # or another Groq model
            temperature=0.3,
            max_tokens=1024
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error with Groq API: {e}")
        return "I encountered an error while processing your request. Please try again later."


if __name__ == "__main__":
    print(f"Welcome to the {bot_name} assistant. Type 'quit' to exit.")
    while True:
        sentence = input("You: ")
        if sentence.lower() == "quit":
            break

        resp = get_response(sentence)
        print(f"{bot_name}: {resp}")