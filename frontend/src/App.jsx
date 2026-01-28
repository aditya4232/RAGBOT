import { useState, useEffect, useRef } from 'react';
import ModeSwitch from './components/ModeSwitch';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('chatMode') || 'local';
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let responseText = '';
      let source = mode;
      let confidence = '';

      if (mode === 'local') {
        // Local RAG endpoint
        const response = await fetch('/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: content }),
        });
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('RAG Response:', data);
        
        // Get the answer with multiple fallbacks
        if (data.answer && data.answer.trim() !== '') {
          responseText = data.answer.trim();
        } else if (data.retrieved_text && data.retrieved_text.trim() !== '') {
          responseText = data.retrieved_text.trim();
        } else if (data.error) {
          responseText = `Error: ${data.error}`;
        } else {
          responseText = 'No matching information found in the knowledge base.';
        }
        
        // Add confidence indicator if available
        if (data.confidence) {
          confidence = data.confidence;
        }
        
        console.log('Response Text:', responseText, 'Confidence:', confidence);
      } else {
        // Cloud API endpoint (proxied through FastAPI)
        const response = await fetch(`/chat?prompt=${encodeURIComponent(content)}`);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Cloud API Response:', data);
        
        if (data.success && data.response) {
          responseText = data.response;
        } else if (data.response) {
          responseText = data.response;
        } else {
          responseText = 'Sorry, failed to get a response from the Cloud API.';
        }
      }

      // Ensure we never have empty response
      if (!responseText || responseText.trim() === '') {
        responseText = 'Unable to generate a response. Please try again.';
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
        source,
        confidence,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Connection Error: ${error.message || 'Failed to connect to the server. Please make sure the backend is running.'}`,
        timestamp: new Date().toISOString(),
        source: mode,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="title">RAG Chat</h1>
        </div>
        <div className="header-center">
          <ModeSwitch mode={mode} onModeChange={setMode} />
        </div>
        <div className="header-right">
          <button className="clear-btn" onClick={handleClearChat} title="Clear chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </header>

      <main className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2>Welcome to RAG Chat</h2>
              <p>
                {mode === 'local' 
                  ? 'Ask questions about the loaded notes using Local RAG search.'
                  : 'Chat with GPT-4 powered Cloud API for any question.'}
              </p>
              <div className="mode-info">
                <span className={`mode-badge ${mode}`}>
                  {mode === 'local' ? 'Local RAG Mode' : 'Cloud API Mode'}
                </span>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="input-container">
        <ChatInput onSend={handleSend} disabled={isLoading} />
        <div className="watermark">@madeby Aditya</div>
      </footer>
    </div>
  );
}

export default App;
