import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { 
      text: "Namaste! I am your Bharat AI Finance Copilot. How can I help you with your savings or investments today?", 
      isBot: true, 
      originalQuery: null 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Fake Personalization State
  const [income, setIncome] = useState("50000");
  const [risk, setRisk] = useState("Low");

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (customMessage = null, isSimplify = false) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend) return;
    
    if (!isSimplify) {
      setMessages(prev => [...prev, { text: textToSend, isBot: false, originalQuery: null }]);
      setInput("");
    } else {
      setMessages(prev => [...prev, { text: "Explain that again simply...", isBot: false, originalQuery: null }]);
    }
    
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: textToSend, 
          language: "en", 
          simplify: isSimplify,
          monthly_income: income,
          risk_level: risk
        })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { text: data.response, isBot: true, originalQuery: textToSend }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I couldn't connect to the server. Please try again.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  // Parser to detect projections and basic markdown
  const renderMessageContent = (text) => {
    return text.split('\n').map((line, i) => {
      // Detect Future Projection lines
      if (line.trim().startsWith('-') && (line.includes('₹') || line.includes('Rs'))) {
        return (
          <div key={i} className="projection-card">
            <span className="projection-icon">📈</span>
            <span className="projection-text">{line.replace('-', '').trim()}</span>
          </div>
        );
      }
      
      // Basic bold markdown parser (**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className="message-line">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="highlight-text">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Bharat AI Finance Copilot</h1>
          <p className="subtitle">Understand money. Make better decisions.</p>
        </div>
        
        <div className="profile-bar">
          <div className="profile-item">
            <span className="profile-icon">💰</span>
            <input 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(e.target.value)} 
              className="profile-input"
              title="Monthly Income"
            />
          </div>
          <div className="profile-item">
            <span className="profile-icon">🛡️</span>
            <select 
              value={risk} 
              onChange={(e) => setRisk(e.target.value)} 
              className="profile-select"
              title="Risk Appetite"
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
      </header>

      <div className="chat-container">
        {messages.map((msg, idx) => {
          let displayTag = null;
          let displayText = msg.text;
          
          if (msg.isBot) {
            if (displayText.includes('[TAG: SAFE]')) { displayTag = 'SAFE'; displayText = displayText.replace('[TAG: SAFE]', '').trim(); }
            else if (displayText.includes('[TAG: MODERATE]')) { displayTag = 'MODERATE'; displayText = displayText.replace('[TAG: MODERATE]', '').trim(); }
            else if (displayText.includes('[TAG: HIGH]')) { displayTag = 'HIGH'; displayText = displayText.replace('[TAG: HIGH]', '').trim(); }
          }

          return (
            <div key={idx} className={`message-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
              <div className={`message-content ${msg.isBot ? 'bot-content' : 'user-content'}`}>
                <div className={`message ${msg.isBot ? 'bot-msg' : 'user-msg'}`}>
                  {renderMessageContent(displayText)}
                  
                  {displayTag === 'SAFE' && <div className="risk-badge risk-safe">🟢 Safe option</div>}
                  {displayTag === 'MODERATE' && <div className="risk-badge risk-moderate">🟡 Moderate growth</div>}
                  {displayTag === 'HIGH' && <div className="risk-badge risk-high">🔴 High risk</div>}
                </div>
                {msg.isBot && msg.originalQuery && (
                  <button 
                    className="simplify-btn" 
                    onClick={() => sendMessage(msg.originalQuery, true)}
                    disabled={loading}
                  >
                    <span className="sparkle">✨</span> Simplify (Explain like I'm 15)
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="message-wrapper bot">
            <div className="message-content bot-content">
              <div className="message bot-msg typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
        
        {messages.length === 1 && !loading && (
          <div className="starter-state">
            <div className="starter-section">
              <h3>💡 Try asking:</h3>
              <div className="starter-chips">
                <button onClick={() => sendMessage("Mere paas ₹1 lakh hai, kya karu?", false)}>Mere paas ₹1 lakh hai, kya karu?</button>
                <button onClick={() => sendMessage("How to save from 50k salary?", false)}>How to save from 50k salary?</button>
                <button onClick={() => sendMessage("FD vs mutual fund?", false)}>FD vs mutual fund?</button>
              </div>
            </div>
            
            <div className="starter-section">
              <h3>📈 Projected Growth</h3>
              <div className="projection-preview-card">
                <div className="preview-header">If you invest ₹1,00,000 at 8.5%</div>
                <div className="preview-body">
                  <span className="projection-icon">📈</span>
                  <span className="projection-text"><strong>₹1,50,365</strong> in 5 years</span>
                </div>
                <div className="preview-footer">
                  That's ~50% growth over 5 years ✨
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bottom-section">
        <div className="suggestions-container">
          <button className="suggestion-chip" onClick={() => sendMessage("Where should I invest?", false)} disabled={loading}>
            🎯 Where should I invest?
          </button>
          <button className="suggestion-chip" onClick={() => sendMessage("Best FD options", false)} disabled={loading}>
            🏦 Best FD options
          </button>
          <button className="suggestion-chip" onClick={() => sendMessage("How to save money?", false)} disabled={loading}>
            💡 How to save money?
          </button>
        </div>

        <div className="input-container">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(null, false)}
            placeholder="Ask about savings, investments, or FDs..."
          />
          <button className="send-btn" onClick={() => sendMessage(null, false)} disabled={loading || !input.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="send-icon">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <div className="disclaimer-text">
          Rates are indicative for demo purposes
        </div>
      </div>
    </div>
  );
}

export default App;
