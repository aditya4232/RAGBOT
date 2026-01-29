import { useState } from 'react';

function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Calculate percentage from similarity score (0 to 1 -> 0% to 100%)
  const getScorePercentage = () => {
    if (message.similarityScore === null || message.similarityScore === undefined) {
      return null;
    }
    return Math.round(message.similarityScore * 100);
  };

  // Get confidence level color class
  const getConfidenceClass = () => {
    const score = message.similarityScore;
    if (score === null || score === undefined) return '';
    if (score > 0.5) return 'high';
    if (score > 0.3) return 'medium';
    return 'low';
  };

  const scorePercentage = getScorePercentage();
  const confidenceClass = getConfidenceClass();

  return (
    <div className={`message ${message.role}`}>
      <div className="message-header">
        <span className="message-role">
          {message.role === 'user' ? 'You' : 'Assistant'}
        </span>
        {message.role === 'assistant' && message.source && (
          <span className={`message-source ${message.source}`}>
            via {message.source === 'local' ? 'Local RAG' : 'GPT-4'}
          </span>
        )}
        <span className="message-time">{formatTime(message.timestamp)}</span>
        {message.role === 'assistant' && (
          <button 
            className="copy-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        )}
      </div>
      
      {/* Similarity Score Progress Bar - Only for Local RAG responses */}
      {message.role === 'assistant' && message.source === 'local' && scorePercentage !== null && (
        <div className="similarity-section">
          <div className="similarity-bar-container">
            <div 
              className={`similarity-bar ${confidenceClass}`}
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
          <span className="similarity-percentage">{scorePercentage}% Match</span>
        </div>
      )}
      
      <div className="message-content">
        {message.content}
      </div>
      
      {/* Confidence Badge - Only for Local RAG responses */}
      {message.role === 'assistant' && message.source === 'local' && message.confidence && (
        <div className="confidence-badge-container">
          <span className={`confidence-badge ${confidenceClass}`}>
            Confidence: {message.confidence.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
