import React, { useState, useRef, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './Assignment.css';

const Assignment = ({ onNavigateHome }) => {
  const [limitAnswer, setLimitAnswer] = useState('');
  const [selectedJustification, setSelectedJustification] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', message: 'You answered that the limit approached infinity. Let me help you understand this limit problem step by step.' }
  ]);
  const [chatWidth, setChatWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  
  // Replace isChatLoading with isAITyping for inline loading
  const [isAITyping, setIsAITyping] = useState(false);
  const chatEndRef = useRef(null); // for autoscroll

  const handleSubmit = () => {
    if (limitAnswer.trim() !== '' && selectedJustification !== null) {
      setIsSubmitted(true);
      // Show chatbot immediately if the answer is incorrect
      const isLimitCorrect = limitAnswer.trim().toUpperCase() === correctLimitAnswer;
      const isJustificationCorrect = selectedJustification === correctJustification;
      const isFullyCorrect = isLimitCorrect && isJustificationCorrect;
      if (!isFullyCorrect) {
        // Show chat immediately with typing indicator
        setShowChatbot(true);
        setIsAITyping(true);
        // Simulate AI response delay with typing indicator
        setTimeout(() => {
          setIsAITyping(false);
        }, 1000 + Math.random() * 2000);
      }
    }
  };

  // Auto-scroll chat to bottom when chatHistory or isAITyping changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAITyping]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim() !== '' && !isAITyping) {
      setIsAITyping(true);
      setChatHistory(prev => ([
        ...prev,
        { sender: 'student', message: chatMessage }
      ]));
      setChatMessage('');
      setTimeout(() => {
        setChatHistory(prev => ([
          ...prev,
          { sender: 'ai', message: 'Great question! Infinity is not a real number, so it often means a value does not exist (DNE) in the usual sense. In limits, when we say a function approaches infinity, the limit technically does not exist, but we describe its behavior as diverging to infinity.' }
        ]));
        setIsAITyping(false);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const containerWidth = window.innerWidth;
    const newChatWidth = containerWidth - e.clientX;
    
    // Set minimum and maximum widths
    const minWidth = 300;
    const maxWidth = containerWidth * 0.7;
    
    if (newChatWidth >= minWidth && newChatWidth <= maxWidth) {
      setChatWidth(newChatWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add event listeners for mouse move and up
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleBackToHome = () => {
    onNavigateHome();
  };
  
  const limitExpression = "\\lim_{x \\to 3} \\frac{\\sqrt{x+9}-3}{x-3}";
  const correctLimitAnswer = 'DNE';
  const correctJustification = 'B';

  const isLimitCorrect = limitAnswer.trim().toUpperCase() === correctLimitAnswer;
  const isJustificationCorrect = selectedJustification === correctJustification;
  const isFullyCorrect = isLimitCorrect && isJustificationCorrect;

  const justificationOptions = [
    { id: 'A', text_start: 'The limit does not exist, because ', math: `${limitExpression} = -\\infty.`, text_end: ''},
    { id: 'B', text_start: 'The limit does not exist, because ', math: limitExpression, text_end: ' is undefined.'},
    { id: 'C', text_start: 'The limit does not exist, because ', math: `${limitExpression} = \\infty.`, text_end: ''},
    { id: 'D', text_start: 'The limit exists, because ', math: `${limitExpression} = L`, text_end: ', where L is a real number.'}
  ];

  return (
    <div className={`assignment-container ${isResizing ? 'resizing' : ''}`}>
      <main className="assignment-main">
        {/* Assignment Content */}
        <div className="assignment-content">
          <div className="question-container">
            <h1 className="question-title">Question 1 of 1</h1>
            <div className="question-text">
              <p>Evaluate the limit.</p>
              <p className="instructions">Give your answer in exact form. If the limit does not exist, enter DNE.</p>
            </div>

            <div className="limit-problem">
              <BlockMath math={limitExpression + " ="} />
              <input 
                type="text" 
                className="limit-input"
                value={limitAnswer}
                onChange={(e) => setLimitAnswer(e.target.value)}
                disabled={isSubmitted}
              />
            </div>

            <div className="justification-section">
              <h2 className="justification-title">Select the statement that justifies your answer.</h2>
              <div className="options-container">
                {justificationOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`option-button ${selectedJustification === option.id ? 'selected' : ''} ${
                    isSubmitted && selectedJustification === option.id && option.id !== correctJustification ? 'incorrect' : ''
                  }`}
                    onClick={() => setSelectedJustification(option.id)}
                    disabled={isSubmitted}
                  >
                    <span className="option-letter">{option.id}.</span>
                    <span className="option-text">
                      {option.text_start}
                      <InlineMath math={option.math} />
                      {option.text_end}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {!isSubmitted ? (
              <button
                className={`submit-button ${limitAnswer.trim() !== '' && selectedJustification !== null ? 'active' : ''}`}
                onClick={handleSubmit}
                disabled={limitAnswer.trim() === '' || selectedJustification === null}
              >
                Submit Answer
              </button>
            ) : (
              <div className="feedback-container">
                <div className={`feedback ${isFullyCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="feedback-icon">{isFullyCorrect ? '✓' : '✗'}</span>
                  <span className="feedback-text">
                    {isFullyCorrect ? 'Correct!' : 'Incorrect. Try again or ask for help!'}
                  </span>
                </div>
                <button className="next-button">
                  Next Question
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Divider - only show when chatbot is visible */}
        {showChatbot && (
          <div 
            className={`vertical-divider ${isResizing ? 'resizing' : ''}`}
            onMouseDown={handleMouseDown}
          ></div>
        )}

        {/* Chatbot Window - show immediately when answer is wrong */}
        {showChatbot && (
          <div className="chatbot-container" style={{ width: chatWidth }}>
            <div className="chatbot-header">
              <h3>Hello, Ronald</h3>
              <p>I'm here to guide you through this problem.</p>
            </div>
            <div className="chat-history" style={{ height: '350px', overflowY: 'auto' }}>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.sender}`}>
                  <div className="message-content">
                    {chat.message}
                  </div>
                </div>
              ))}
              {/* Add typing indicator like SocraticDialogue */}
              {isAITyping && (
                <div className="chat-message ai typing-indicator">
                  <div className="message-content">
                    <span className="typing-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                className="chat-input"
                placeholder="What would you like help with?"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={isAITyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAITyping) {
                    handleChatSubmit(e);
                  }
                }}
              />
              <button type="submit" className="chat-send-button" disabled={isAITyping}>
                Send
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Assignment; 