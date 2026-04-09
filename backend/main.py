import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

# Load environment variables (expecting GROQ_API_KEY)
load_dotenv()

app = FastAPI(title="Bharat AI Finance Copilot")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq Client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

from typing import Optional

def calculate_fd_return(principal, rate, years):
    return int(principal * ((1 + rate) ** years))

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    simplify: bool = False
    monthly_income: Optional[str] = None
    risk_level: Optional[str] = None

class ChatResponse(BaseModel):
    response: str

FD_DATA = """
Current Top FD Rates (Small Finance Banks):
- Suryoday Small Finance Bank: 8.5% (highest return)
- AU Small Finance Bank: 8.0% (balanced)
- Ujjivan Small Finance Bank: 7.8% (safe)
"""

SYSTEM_PROMPT = """You are a friendly Indian financial advisor who speaks like a caring elder sibling.

Rules:
- Explain in VERY simple language (no jargon)
- Be slightly emotional and relatable
- Use real-life examples (salary, family, savings)
- Always give a clear recommendation, but use "confidence language" (e.g., "based on current options", "generally speaking", "one good option could be"). Never sound 100% certain.
- Compare options to make it smart (e.g., "3 options hain... Agar aapko maximum return chahiye -> X best hai").
- If giving investment advice, ALWAYS include a "Future Projection" in simple bullet points showing how their money grows over time. Use the provided projection context if available.
- Keep answers short but impactful.
- Based on your recommendation, you MUST append ONE of these exact tags at the very end (before the disclaimer):
  [TAG: SAFE] (for FDs, savings, low risk)
  [TAG: MODERATE] (for mutual funds, balanced)
  [TAG: HIGH] (for stocks, high risk)
- ALWAYS append this exact disclaimer at the very end of your message: "\n\nNote: Rates may vary slightly. Please verify before investing."

Format:
1. Simple explanation
2. What you should do (compare options clearly)
3. Why it’s good for you

Tone examples:
- "Ek strong option Suryoday Bank ho sakta hai..."
- “Agar aap safe rehna chahte ho…”
- “Simple language mein samjhau toh…”
- “Best option aapke liye yeh hoga…”

Language:
- If Hindi → reply Hindi
- Else → Hinglish (not pure English)"""

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    context = ""
    if request.monthly_income and request.risk_level:
        context += f"\nUser profile:\n- Income: ₹{request.monthly_income}/month\n- Risk appetite: {request.risk_level}"

    msg_lower = request.message.lower()
    
    # Financial Logic Layer - Keyword Detection
    is_investment = False
    p = 100000 # default principal
    
    # Smarter Principal Extraction (Handles "1 lakh", "50k", etc. for demo WOW factor)
    lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lac)', msg_lower)
    k_match = re.search(r'(\d+(?:\.\d+)?)\s*k\b', msg_lower)
    
    if lakh_match:
        p = float(lakh_match.group(1)) * 100000
    elif k_match:
        p = float(k_match.group(1)) * 1000
    else:
        numbers = re.findall(r'\d+(?:,\d+)*(?:\.\d+)?', msg_lower)
        for num_str in numbers:
            try:
                val = float(num_str.replace(',', ''))
                if val >= 1000: # assume values >= 1000 are investment amounts
                    p = val
                    break
            except:
                pass

    if any(word in msg_lower for word in ["fd", "fixed deposit", "safe", "secure"]):
        context += f"\nContext: User is looking for safe options like FD. Use this data: {FD_DATA}"
        is_investment = True
    if any(word in msg_lower for word in ["risk", "grow money", "invest", "return"]):
        context += "\nContext: User wants to grow money. Suggest mutual funds or index funds, but mention risk clearly."
        is_investment = True

    if is_investment:
        r = 0.085 # Using best FD rate for projection
        year1 = calculate_fd_return(p, r, 1)
        year3 = calculate_fd_return(p, r, 3)
        year5 = calculate_fd_return(p, r, 5)
        context += f"\n\nProjection Context (Include this in your answer to show how money grows):\nIf the user invests ₹{int(p):,} at {r*100}% interest:\n- 1 saal baad: ~₹{year1:,}\n- 3 saal baad: ~₹{year3:,}\n- 5 saal baad: ~₹{year5:,}"

    if request.simplify:
        context += "\nExplain this like I am 15 years old. Use very simple words and analogies."

    messages = [{"role": "system", "content": SYSTEM_PROMPT + context}]
    messages.append({"role": "user", "content": request.message})

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant", # Recommended fast model on Groq
            temperature=0.6,
        )
        reply = chat_completion.choices[0].message.content
        return ChatResponse(response=reply)
    except Exception as e:
        return ChatResponse(response=f"Error generating response: {str(e)}")
