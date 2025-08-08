import React, { useState, useRef, useEffect } from 'react';
import './SocraticDialogue.css';
import ProgressBar from 'progressbar.js';

const SocraticDialogue = ({ onNavigateHome, onUnderstandingChange }) => {
  const [initialResponse, setInitialResponse] = useState('');
  const [hasSubmittedInitial, setHasSubmittedInitial] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes
  const timerRef = useRef(null);
  const [understandingScore, setUnderstandingScore] = useState(0);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef(null);
  const progressBarInstance = useRef(null);
  const [showProgress, setShowProgress] = useState(true); // controls progress bar/score visibility
  const chatEndRef = useRef(null); // for autoscroll
  const chatHistoryRef = useRef(null); // for chat container scroll
  const chatInputRef = useRef(null); // for auto-focusing input

  const conceptualQuestion = "Why do you think the limit of a function at a point and the function's value at that point are related to continuity?";

  // Start timer after first student message
  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [timerStarted, timeLeft]);



  // Dummy understanding assessment (for demo only)
  const assessUnderstanding = (userMessage) => {
    let increment = 0;

    // Increase score based on key terms
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('initial condition')) increment += 15;
    if (lowerMessage.includes('independent') || lowerMessage.includes('dependence')) increment += 15;
    if (lowerMessage.includes('overdetermined') || lowerMessage.includes('system')) increment += 15;
    if (lowerMessage.includes('dimension') || lowerMessage.includes('solution')) increment += 10;
    if (lowerMessage.includes('linear') || lowerMessage.includes('basis')) increment += 10;

    // Small bonus for any message
    increment += Math.random() * 15;

    const newScore = Math.min(100, understandingScore + increment);
    setUnderstandingScore(newScore);
    
    // Notify parent component of understanding score change
    if (onUnderstandingChange) {
      onUnderstandingChange(newScore);
    }
  };

  // New: progress is always understandingScore / 100
  useEffect(() => {
    setProgress(understandingScore / 100);
  }, [understandingScore]);

  // Initialize and update progressbar.js - only update when progress changes significantly
  useEffect(() => {
    if (progressBarRef.current && showProgress) {
      if (!progressBarInstance.current) {
        progressBarInstance.current = new ProgressBar.Line(progressBarRef.current, {
          easing: 'easeInOut',
          duration: 800,
          color: '#3b82f6',
          trailColor: '#f1f5f9',
          trailWidth: 4,
          strokeWidth: 6,
          svgStyle: { width: '100%', height: '100%' },
        });
      }
      // Only animate if there's a significant change (more than 5%) OR if reaching 100%
      const currentProgress = progressBarInstance.current.value();
      if (Math.abs(progress - currentProgress) > 0.05 || progress === 1.0) {
        progressBarInstance.current.animate(progress, { duration: 800 });
      }
    }
  }, [progress, showProgress]);

  // Timer/modal logic for session duration
  useEffect(() => {
    if (!showChat || !timerStarted || !showProgress) return;
    
    // If user has 100 understanding, allow session to end between 3-5 minutes (180-300 seconds)
    if (understandingScore === 100 && timeLeft <= 180 && timeLeft >= 0) {
      setShowEndModal(true);
    }
    // If user doesn't have 100, only show modal after 5 minutes (timeLeft === 0)
    else if (understandingScore < 100 && timeLeft === 0) {
      setShowEndModal(true);
    }
  }, [timeLeft, understandingScore, showChat, timerStarted, showProgress]);

  // Auto-scroll chat to bottom when chatHistory or isAITyping changes
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, isAITyping]);

  // Auto-focus chat input after AI responses and when chat first shows
  useEffect(() => {
    if (showChat && chatInputRef.current && !isAITyping) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);
    }
  }, [showChat, isAITyping]);

  const handleInitialSubmit = () => {
    if (initialResponse.trim() !== '') {
      setHasSubmittedInitial(true);
      
      // Get the first response from the getAIResponse array
      const firstAIResponse = getAIResponse('', 1); // conversationLength = 1 for the first response
      
      // Add initial response to chat history and show chat immediately
      const initialChatHistory = [
        { sender: 'student', message: initialResponse },
        { sender: 'ai', message: firstAIResponse }
      ];
  
      setShowChat(true);
      setChatHistory(initialChatHistory);
    }
  };

  const getAIResponse = (userMessage, conversationLength) => {
    // Fixed responses array - outputs in order regardless of input
    const responses = [
      "Great intuition! You've identified that continuity is about avoiding \"jumps or breaks.\"\n\nLet me ask you this: When you say the limit and function value \"should be the same,\" what exactly do you mean by \"the limit\"? If I'm approaching a point from different directions, what should happen?",
      
      "Excellent! You're talking about the limit existing, which means the left-hand and right-hand limits must be equal.\n\nNow here's a key question: Suppose I have a function where the left and right limits both equal 5 as x approaches 2. Does that automatically make the function continuous at x = 2?",
      
      "Hmm, let me give you a specific example. Consider this function:\nf(x) = 5 for all x ≠ 2, but f(2) = 10\n\nWhat's the limit as x approaches 2? And what's the function value at x = 2?",
      
      "Exactly! So even though the limit exists and equals 5, the function isn't continuous at x = 2.\n\nThis tells us that for continuity, we need more than just the limit to exist. What additional condition do you think we need?",
      
      "Perfect! So we're building up the definition of continuity piece by piece.\n\nBut wait - there's actually one more condition we haven't talked about yet. What if the function wasn't even defined at x = 2? Could we talk about continuity there?",
      
      "Excellent reasoning! So for continuity at a point, the function must first be defined there.\n\nNow, let me ask you this: If I have a function that satisfies all our conditions - it's defined at a point, the limit exists, and the limit equals the function value - but then I change just the function value at that one point, what happens to continuity?",
      
      "Right! And what type of discontinuity would that be? Think about what the graph would look like.",
      
      "Good thinking! Actually, it would be what we call a \"removable discontinuity\" - like a single point that's out of place. The limit still exists, but the function value doesn't match.\n\nNow here's the deeper question: Why do you think mathematicians care so much about this precise definition of continuity? What does it allow us to do?",
      
      "You're on the right track! Think about it this way: if a function is continuous on an interval, what can you say about its behavior? Can you make any predictions about what happens between two points?",
      
      "Exactly! Continuity gives us predictability. If a function is continuous, we know it doesn't have any sudden jumps or breaks.\n\nNow, let's connect this back to limits: Why do you think the limit and function value need to be equal for continuity? What would happen if they weren't?",
      
      "Perfect! You've really grasped the connection. The limit tells us what the function is approaching, and the function value tells us what it actually is at that point.\n\nFor continuity, these must match - otherwise, there's a gap or jump. This is why the precise definition matters so much in calculus and analysis.",
      
      "Excellent work! You've successfully explored the relationship between limits and continuity. You understand that:\n\n• Continuity requires the function to be defined at the point\n• The limit must exist at that point\n• The limit must equal the function value\n\nThis foundational understanding will serve you well in calculus and beyond!"
    ];
    
    // Calculate response index accounting for initial messages
    // conversationLength includes: initial student message + initial AI response + subsequent user messages
    // We want to skip the initial AI response (index 0) and start from the first chat response (index 1)
    const responseIndex = Math.floor((conversationLength - 2) / 2) + 1; // -2 to account for initial messages, +1 to start from second response
    
    if (responseIndex < responses.length) {
      return responses[responseIndex];
    } else {
      return responses[responses.length - 1]; // Return last response for any additional messages
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim() !== '' && !isAITyping && !isAILoading) {
      if (!timerStarted) setTimerStarted(true); // Start timer on first message
      assessUnderstanding(chatMessage); // Assessment
      const aiResponse = getAIResponse(chatMessage, chatHistory.length);
      setChatHistory([...chatHistory, { sender: 'student', message: chatMessage }]);
      setChatMessage('');
      setIsAILoading(true);
      
      // Auto-scroll after adding user message
      setTimeout(() => {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
      }, 100);
      
      // Show loading dots for 1-2 seconds before starting to type
      setTimeout(() => {
        setIsAILoading(false);
        setIsAITyping(true);
        
        setTimeout(() => {
          // Add empty AI message first
          setChatHistory((prev) => [...prev, { sender: 'ai', message: '', isTyping: true }]);
          
          // Type out the response character by character
          let currentText = '';
          const typeInterval = setInterval(() => {
            if (currentText.length < aiResponse.length) {
              currentText += aiResponse[currentText.length];
              setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { 
                  sender: 'ai', 
                  message: currentText,
                  isTyping: true 
                };
                return newHistory;
              });
            } else {
              clearInterval(typeInterval);
              setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { 
                  sender: 'ai', 
                  message: currentText,
                  isTyping: false 
                };
                return newHistory;
              });
              setIsAITyping(false);
            }
          }, 8); // Very fast typing speed - 8ms per character
          
          // Auto-scroll after AI response with longer delay
          setTimeout(() => {
            if (chatHistoryRef.current) {
              chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
          }, 300);
          
          // Additional scroll to ensure we're at the very bottom
          setTimeout(() => {
            if (chatHistoryRef.current) {
              chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
          }, 500);
          
          // Force scroll to bottom after DOM updates
          setTimeout(() => {
            if (chatHistoryRef.current) {
              chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
              // Force a reflow to ensure scroll position is applied
              void chatHistoryRef.current.offsetHeight;
              chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
          }, 800);
        }, 500 + Math.random() * 1000); // Reduced from 1-3s to 0.5-1.5s delay
      }, 1000 + Math.random() * 1000); // 1-2 seconds of loading
    }
  };



  const handleContinue = () => {
    setShowEndModal(false);
    // Progress bar will persist - removed setShowProgress(false)
  };

  const handleGoHome = () => {
    setShowEndModal(false);
    onNavigateHome();
  };

  return (
    <div className="socratic-container">
      <main className="socratic-main">
        {/* Initial Question Phase */}
        {!hasSubmittedInitial && (
          <div className="initial-question-container">
            <div className="question-content">
              <div className="question-badge">Limits and Continuity</div>
              <h1 className="conceptual-question">{conceptualQuestion}</h1>
              
              <div className="initial-response-section">
                <textarea
                  className="initial-response-textarea"
                  placeholder="Share your thoughts here..."
                  value={initialResponse}
                  onChange={(e) => setInitialResponse(e.target.value)}
                  rows={4}
                />
                
                <button
                  className={`submit-response-button ${initialResponse.trim() !== '' ? 'active' : ''}`}
                  onClick={handleInitialSubmit}
                  disabled={initialResponse.trim() === ''}
                >
                  Start Dialogue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Phase */}
        {showChat && (
          <div className="socratic-chat-container">
            {showProgress && (
              <div className="progress-section-top">
                <div className="progress-bar-container">
                  <div ref={progressBarRef} className="progress-bar-element" />
                </div>
                <div className="progress-label">{Math.round(progress * 100)}%</div>
              </div>
            )}
            <div className="chat-header-minimal">
            </div>
            <div className="chat-history" ref={chatHistoryRef}>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.sender}`}>
                  {chat.sender === 'ai' && <div className="ai-icon"></div>}
                  <div className="message-content">
                    {chat.message}
                    {chat.isTyping && chat.message.length > 0 && <span className="typing-cursor">|</span>}
                    {chat.isTyping && chat.message.length === 0 && (
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Show loading dots when AI is loading */}
              {isAILoading && (
                <div className="chat-message ai">
                  <div className="ai-icon"></div>
                  <div className="message-content">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-form">
              <input
                ref={chatInputRef}
                type="text"
                className="chat-input"
                placeholder="Continue the dialogue..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={isAITyping || isAILoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAITyping && !isAILoading) {
                    handleChatSubmit(e);
                  }
                }}
              />
              <button onClick={handleChatSubmit} className="chat-send-button" disabled={isAITyping || isAILoading}>
                Send
              </button>
            </div>
            {showEndModal && (
              <div className="end-modal-overlay">
                <div className="end-modal-content">
                  <h2>Complete</h2>
                  <p>Understanding: {Math.round(understandingScore)}%</p>
                  <div className="end-modal-buttons">
                    <button className="continue-btn" onClick={handleContinue}>Continue</button>
                    <button className="home-btn" onClick={handleGoHome}>Back</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SocraticDialogue;