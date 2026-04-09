<div align="center">

# 🇮🇳 Bharat AI Finance Copilot
**Your smart financial guide in simple language.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)]()
[![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![AI](https://img.shields.io/badge/AI-Groq_Llama3-f97316?style=for-the-badge&logo=ai&logoColor=white)]()

</div>

---

## 🚀 Elevator Pitch
**Bharat AI Finance Copilot** is a multilingual, AI-powered financial decision engine built for the everyday Indian. It bridges the gap in financial literacy by explaining complex investment strategies in simple Hindi or Hinglish, simulating your money's growth, and guiding you toward safe, personalized financial decisions.

---

## 🎯 Problem & Solution

**The Problem:** 
Traditional financial tools and advisors are intimidating, filled with complex jargon, and largely inaccessible to Tier 2/3 India. People want to grow their savings but are terrified of making the wrong choice.

**The Solution:** 
An intelligent AI Copilot that acts like a caring elder sibling. It understands your income, assesses your risk appetite, and explains financial concepts using relatable analogies. It doesn't just give advice; it **simulates** your financial future.

---

## ✨ Key Features

* 🗣️ **Multilingual Intelligence:** Speaks natively in Hindi and Hinglish to ensure absolute clarity.
* 📈 **Future Projection Engine:** Instantly calculates and visualizes how your specific investment will grow over 1, 3, and 5 years using compound interest math.
* ✨ **"Simplify" (ELI15):** A 1-click feature that forces the AI to break down complex advice using analogies suitable for a 15-year-old.
* 👤 **Dynamic Personalization:** Adjusts recommendations in real-time based on your stated monthly income and risk tolerance.
* 🛡️ **Confidence Tags:** Automatically categorizes and visually flags advice as `🟢 Safe`, `🟡 Moderate`, or `🔴 High Risk`.
* 🎨 **Premium UI/UX:** A modern, dark-themed, glassmorphic interface that feels like a funded startup product, not a hackathon demo.

---

## 🧱 Tech Stack

* **Frontend:** React.js (Vite) + Custom CSS 
* **Backend:** Python + FastAPI 
* **AI Inference:** Groq API (`llama-3.1-8b-instant` for ultra-low latency streaming)

---

## ⚙️ How It Works

1. **Context Gathering:** The React frontend captures the user's query alongside their current "Income" and "Risk" toggle states.
2. **Logic Layer (FastAPI):** The backend intercepts the query. Regex extracts exact investment amounts (e.g., "1.5 lakh" -> `150000`) and runs a lightweight math engine to project future returns.
3. **Prompt Engineering:** A highly structured, dynamic prompt is built combining the user's profile, the math projections, and strict behavioral rules ("act like an elder sibling", "no jargon").
4. **AI Generation (Groq):** The LLM generates the advice and appends hidden metadata tags (like `[TAG: SAFE]`).
5. **UI Rendering:** The frontend parses the response, replacing markdown with beautiful UI projection cards and risk badges.

---

## ▶️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/bharat-ai-finance.git
cd bharat-ai-finance
```

### 2. Backend Setup
```bash
cd backend
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 🔑 Environment Setup

To run the AI, you need a free Groq API key.
1. Create a file named `.env` inside the `/backend` directory.
2. Add your key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🎬 Demo Usage

Try pasting these exact phrases into the Copilot to see the magic:

* *"Mere paas ₹1.5 lakh hai, safe investment chahiye"* (Watch the math engine project returns on exactly 1.5L)
* *"I earn 50k/month, how to save?"* (Watch it reference your income)
* *"FD vs mutual fund, dono mein kya farq hai?"* (Click the "✨ Simplify" button on the response)

---

## 🌍 Future Scope

* **Real-time API Integration:** Connect to live banking APIs (like RBI or major banks) to fetch live, daily FD and Mutual Fund rates instead of indicative data.
* **Portfolio Upload:** Allow users to upload a PDF statement for instant AI analysis.
* **WhatsApp Integration:** Deploy the conversational engine directly to WhatsApp to reach the next billion users in India.

---

## ⚠️ Disclaimer

*This project was built for a hackathon. All financial rates, banks mentioned, and projections are indicative and simulated for demonstration purposes. This is not licensed financial advice.*