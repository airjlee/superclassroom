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
  const [showEndModal, setShowEndModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef(null);
  const progressBarInstance = useRef(null);
  const [showProgress, setShowProgress] = useState(true); // controls progress bar/score visibility
  const chatEndRef = useRef(null); // for autoscroll
  const chatHistoryRef = useRef(null); // for chat container scroll
  const chatInputRef = useRef(null); // for auto-focusing input

  const conceptualQuestion = "Why do you think linear independence is important for general solutions when dealing with repeated roots in ODEs?";

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
      
      // Add initial response to chat history and show chat immediately
      const initialChatHistory = [
        { sender: 'student', message: initialResponse },
        { sender: 'ai', message: 'Excellent! You\'ve touched on something really important - that linear independence helps us "capture the full behavior" of the differential equation.\n\nLet me ask you this: What does it mean mathematically for a second-order differential equation to have "full behavior"? In other words, how many independent pieces of information do you think we need to completely describe all possible solutions?' }
      ];

      setShowChat(true);
      setChatHistory(initialChatHistory);
    }
  };

  const getAIResponse = (userMessage, conversationLength) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Response based on conversation stage and content
    if (conversationLength <= 2) {
      if (lowerMessage.includes('two') || lowerMessage.includes('2')) {
        return 'Good instinct on the "two"! You\'re absolutely right for second-order equations.\n\nHere\'s a way to think about it: If I gave you a second-order differential equation and said "find the specific solution," what additional information would I need to give you to pin down exactly which solution I want?';
      }
      return 'Let me help guide your thinking. For a second-order differential equation, think about how many pieces of information you typically need. What\'s your guess?';
    }
    
    if (conversationLength <= 4) {
      if (lowerMessage.includes('initial') || lowerMessage.includes('condition')) {
        return 'Exactly! Initial conditions. And for a second-order equation, how many initial conditions do you think I\'d typically need to give you?\n\nOnce you answer that, I think we\'ll start to see why that number "two" you guessed earlier is so important...';
      }
      return 'Think about what extra information would help you find one specific solution out of infinitely many possible solutions...';
    }
    
    if (conversationLength <= 6) {
      if (lowerMessage.includes('two') || lowerMessage.includes('2')) {
        return 'Perfect! So we need two initial conditions to pin down a unique solution to a second-order differential equation.\n\nNow here\'s the key connection: If our general solution has two arbitrary constants - like y = c₁y₁ + c₂y₂ - and we have two initial conditions, we can solve for those constants and get our specific solution.\n\nBut what do you think would happen if y₁ and y₂ weren\'t linearly independent? What would that mean for our ability to satisfy any given pair of initial conditions?';
      }
      return 'For a second-order equation, how many initial conditions do you typically need?';
    }
    
    if (conversationLength <= 8) {
      if (lowerMessage.includes('can\'t') || lowerMessage.includes('cannot') || lowerMessage.includes('constant')) {
        return 'Exactly! You only have one effective constant instead of two.\n\nNow here\'s the critical question: If you have only one constant to determine, but you need to satisfy two initial conditions, what\'s the problem?';
      }
      return 'Think about what happens when functions aren\'t linearly independent - how many effective constants would you really have?';
    }
    
    if (conversationLength <= 10) {
      if (lowerMessage.includes('one') || lowerMessage.includes('apply')) {
        return 'Close! Actually, you can still apply both initial conditions - you can still write down the two equations.\n\nBut here\'s the real issue: what happens when you try to solve that system of two equations but you only have one unknown constant?';
      }
      return 'What\'s the mathematical problem when you have only one constant but two initial conditions to satisfy?';
    }
    
    if (conversationLength <= 12) {
      if (lowerMessage.includes('not sure') || lowerMessage.includes('don\'t know')) {
        return 'Think about it this way: you\'d have two equations but only one unknown.\n\nIn general, what happens when you have more equations than unknowns in a system? Is such a system always guaranteed to have a solution?';
      }
      return 'Consider: two equations, one unknown. What kind of system is that?';
    }
    
    if (conversationLength <= 14) {
      if (lowerMessage.includes('no solution') || lowerMessage.includes('overdetermined')) {
        return 'Exactly! Most of the time there\'s no solution - the system is overdetermined.\n\nSo this connects back to your original insight about "capturing the full behavior." If your functions aren\'t linearly independent, you can\'t satisfy arbitrary initial conditions, which means you\'re missing some of the possible behaviors of the differential equation.\n\nNow, can you see why repeated roots create a special problem? What would happen if you tried to use e^(2x) and e^(2x) as your two "solutions" for a repeated root r = 2?';
      }
      return 'What happens when you have more equations than unknowns?';
    }
    
    if (conversationLength <= 16) {
      if (lowerMessage.includes('dependent') || lowerMessage.includes('initial condition')) {
        return 'Beautifully put! You\'ve connected all the pieces.\n\nNow, try answering the original question again: Why do you think linear independence is important for general solutions when dealing with repeated roots in ODEs?\n\nGo ahead and give me your full understanding now - I\'m excited to hear how you\'d explain it!';
      }
      return 'Think about what happens when you use the same solution twice - like e^(2x) and e^(2x). What does that do to your general solution?';
    }
    
    // Final response for comprehensive answer
    if (lowerMessage.includes('overdetermined') || lowerMessage.includes('capture') || lowerMessage.includes('behavior')) {
      return 'Excellent! You\'ve absolutely nailed it. You\'ve connected all the key pieces:\n\n• The need for enough independent constants to match the number of initial conditions\n• How repeated roots create the risk of linear dependence\n• The mathematical consequence - an overdetermined system\n• The bigger picture - that we need to capture the full solution space\n\nThis is exactly the kind of deep understanding that will serve you well. You\'ve moved from a vague sense that "we need the right solution" to a precise understanding of why linear independence is mathematically necessary.\n\n✓ Assignment Complete!';
    }
    
    // Default encouraging response
    return 'You\'re on the right track! Can you elaborate on that thought and connect it back to what we\'ve been discussing about initial conditions?';
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim() !== '') {
      if (!timerStarted) setTimerStarted(true); // Start timer on first message
      assessUnderstanding(chatMessage); // Assessment
      const aiResponse = getAIResponse(chatMessage, chatHistory.length);
      setChatHistory([...chatHistory, { sender: 'student', message: chatMessage }]);
      setChatMessage('');
      setIsAITyping(true);
      
      // Auto-scroll after adding user message
      setTimeout(() => {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
      }, 100);
      
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
      }, 1000 + Math.random() * 2000); // 1-3s delay
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
              <div className="question-badge">Differential Equations</div>
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
            
            <div className="question-illustration">
              <img 
                src="/albert_einstein.svg" 
                alt="Albert Einstein illustration" 
                className="einstein-svg"
              />
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
                disabled={isAITyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isAITyping) {
                    handleChatSubmit(e);
                  }
                }}
              />
              <button onClick={handleChatSubmit} className="chat-send-button" disabled={isAITyping}>
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