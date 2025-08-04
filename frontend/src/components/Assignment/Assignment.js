import React, { useState, useRef, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './Assignment.css';
import '../../shared/components.css';
import SocraticDialogue from '../SocraticDialogue/SocraticDialogue';

// Helper function to render math expressions in text
const renderMathInText = (text) => {
  const parts = [];
  let currentIndex = 0;
  
  // Find all math expressions ($...$ or $$...$$)
  const mathRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let match;
  
  while ((match = mathRegex.exec(text)) !== null) {
    // Add text before the math expression
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: text.slice(currentIndex, match.index)
      });
    }
    
    // Add the math expression
    const mathContent = match[1] || match[2]; // $$...$$ or $...$
    const isBlock = match[0].startsWith('$$');
    
    parts.push({
      type: 'math',
      content: mathContent,
      isBlock: isBlock
    });
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(currentIndex)
    });
  }
  
  return parts;
};

const Assignment = ({ onNavigateHome }) => {
  // Question flow state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const totalQuestions = 2;

  // MCQ Question states
  const [limitAnswer, setLimitAnswer] = useState('');
  const [selectedJustification, setSelectedJustification] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // AI Chat states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  const [isAITyping, setIsAITyping] = useState(false);
  const chatEndRef = useRef(null);
  const chatHistoryRef = useRef(null);

  // Demo Socratic Dialogue responses (in order)
  const demoResponses = [
    `Hi! I see you answered "0" and selected option D for this limit problem. Let's work through this together to see why that's not quite right.\nFirst, let me ask you: What happens when we try to substitute x = 3 directly into this expression?\nLook at: $\\frac{\\sqrt{x + 9} - 3}{x - 3}$\nWhat do you get when you plug in x = 3 for both the numerator and denominator?`,
    "I can see you're on the right track with substituting x = 3, but let me help you think about this more carefully.\n\nYou said you get $\\frac{\\sqrt{12} - 3}{0}$, but there's an important issue with your reasoning.\n\nWhen we have any non-zero number divided by 0, what does that actually mean mathematically?",
    "Good thinking! You're absolutely right that division by zero is undefined.\n\nBut here's the key insight: just because direct substitution gives us something undefined doesn't mean the limit itself is undefined.\n\nLet me ask you this: when you substitute x = 3, what do you get in the numerator? Let's calculate $\\sqrt{3 + 9} - 3$ step by step.\n\nWhat is $\\sqrt{3 + 9}$?",
    "Exactly! So we have $\\sqrt{12} - 3$ in the numerator.\n\nNow, can you simplify $\\sqrt{12}$? Think about what $\\sqrt{12}$ equals.\n\nHint: $12 = 4 \\times 3$, so $\\sqrt{12} = \\sqrt{4 \\times 3} = ?$",
    "Perfect! So $\\sqrt{12} = 2\\sqrt{3}$.\n\nThis means our numerator becomes: $2\\sqrt{3} - 3$\n\nNow here's the crucial question: Is $2\\sqrt{3} - 3$ equal to zero?",
    "Exactly right! Since $2\\sqrt{3} - 3 \\neq 0$, we have a non-zero number divided by zero when we substitute directly.\n\nSo when we substitute x = 3, we get: $\\frac{2\\sqrt{3} - 3}{0}$\n\nWhat does this tell us about the behavior of the function as x approaches 3?\n\nThink about it: we have a non-zero numerator and the denominator is approaching 0. What happens to fractions when the denominator gets closer and closer to zero while the numerator stays non-zero?\n\nFor example, what happens to $\\frac{5}{0.1}$, then $\\frac{5}{0.01}$, then $\\frac{5}{0.001}$?",
    "Excellent! You're absolutely right that the values get larger and larger, approaching infinity.\n\nBut here's an important detail we need to check: Does the function approach positive infinity or negative infinity? Or does it depend on which direction we approach from?\n\nLet's think about this. We know that as x approaches 3, the denominator $(x - 3)$ approaches 0, and the numerator approaches $(2\\sqrt{3} - 3)$, which is positive.\n\nNow, what happens when x is slightly less than 3 (like x = 2.9)?\nIs $(x - 3)$ positive or negative?\nAnd what happens when x is slightly greater than 3 (like x = 3.1)?\nIs $(x - 3)$ positive or negative?\n\nThis will help us determine whether the limit approaches $+\\infty$, $-\\infty$, or if the limit doesn't exist at all.",
    "Perfect! You've got it exactly right!\n\nWhen approaching from the left (x < 3): $(x - 3) < 0$, so we get $\\frac{\\text{positive}}{\\text{negative}} \\to -\\infty$\nWhen approaching from the right (x > 3): $(x - 3) > 0$, so we get $\\frac{\\text{positive}}{\\text{positive}} \\to +\\infty$\n\nSo what does this tell us about the limit?\nSince the left-hand limit and right-hand limit are different (one goes to $-\\infty$ and the other to $+\\infty$), what can we conclude about $\\lim_{x \\to 3} \\frac{\\sqrt{x + 9} - 3}{x - 3}$?\n\nLooking back at your answer choices, which option correctly describes this situation?",
    "Excellent! You've got it right!\n\nWhen the left-hand limit approaches $-\\infty$ and the right-hand limit approaches $+\\infty$, the limit does not exist because the function doesn't approach a single value (or even the same type of infinity) from both sides.\n\nSo the correct answer is B: \"The limit does not exist, because $\\lim_{x \\to 3} \\frac{\\sqrt{x+9}-3}{x-3}$ is undefined.\"\n\nYou've successfully worked through this problem! The key insights were:\n• Direct substitution gives $\\frac{2\\sqrt{3}-3}{0}$ (non-zero over zero)\n• This means the function has a vertical asymptote at x = 3\n• The one-sided limits go to opposite infinities\n• Therefore, the overall limit is undefined\n\nGreat job working through this step by step! You can now retry the problem with the correct answer."
  ];
  const [demoStep, setDemoStep] = useState(0);

  // Function to start demo with first response
  const startDemo = () => {
    setShowChatbot(true);
    setDemoStep(0);
    setIsAITyping(true);
    
    // Start typing the first response immediately
    setTimeout(() => {
      const firstResponse = demoResponses[0];
      
      // Add empty AI message first
      setChatHistory([{ sender: 'ai', message: '', isTyping: true }]);
      
      // Type out the response character by character
      let currentText = '';
      const typeInterval = setInterval(() => {
        if (currentText.length < firstResponse.length) {
          currentText += firstResponse[currentText.length];
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
          setDemoStep(1); // Move to next response
        }
      }, 8); // Very fast typing speed - 8ms per character
      
      // Auto-scroll after AI response
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
      
      // Auto-focus the chat input after AI response
      setTimeout(() => {
        const chatInput = document.querySelector('.ai-tutor-panel .chat-input');
        if (chatInput) {
          chatInput.focus();
        }
      }, 1000);
    }, 1000 + Math.random() * 2000);
  };

  const handleSubmit = () => {
    if (limitAnswer.trim() !== '' && selectedJustification !== null) {
      setIsSubmitted(true);
      const isLimitCorrect = limitAnswer.trim().toUpperCase() === correctLimitAnswer;
      const isJustificationCorrect = selectedJustification === correctJustification;
      const isFullyCorrect = isLimitCorrect && isJustificationCorrect;
      
      if (!isFullyCorrect) {
        // Start demo immediately when user gets wrong answer
        startDemo();
      }
    }
  };

  const handleRetryQuestion = () => {
    setIsSubmitted(false);
    setShowChatbot(false);
    setChatHistory([]);
    setDemoStep(0);
    setIsAITyping(false);
  };

  const handleShowTutor = () => {
    if (!isSubmitted) {
      setShowChatbot(true);
      setChatHistory([
        { sender: 'ai', message: 'Hi! I\'m here to help you with this limit problem. What would you like to know?' }
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Reset states when moving to next question
      setLimitAnswer('');
      setSelectedJustification(null);
      setIsSubmitted(false);
      setShowChatbot(false);
      setChatHistory([]);
      setDemoStep(0);
      setIsAITyping(false);
    } else {
      // Finish assignment
      onNavigateHome();
    }
  };

  // Initialize socratic understanding score
  useEffect(() => {
    window.socraticUnderstandingScore = 0;
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, isAITyping]);
  
  // Additional effect to ensure scroll to bottom when typing stops
  useEffect(() => {
    if (!isAITyping && chatHistoryRef.current) {
      setTimeout(() => {
        chatHistoryRef.current.scrollTo({
          top: chatHistoryRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [isAITyping]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim() !== '' && !isAITyping) {
      setIsAITyping(true);
      setChatHistory(prev => ([
        ...prev,
        { sender: 'student', message: chatMessage }
      ]));
      setChatMessage('');
      
      // Auto-scroll after adding user message
      setTimeout(() => {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
      }, 100);
      
      setTimeout(() => {
        const aiResponse = demoResponses[demoStep % demoResponses.length];
        
        // Add empty AI message first
        setChatHistory(prev => ([
          ...prev,
          { sender: 'ai', message: '', isTyping: true }
        ]));
        
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
            setDemoStep(demoStep + 1); // Increment demo step
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
        
        // Auto-focus the chat input after AI response
        setTimeout(() => {
          const chatInput = document.querySelector('.ai-tutor-panel .chat-input');
          if (chatInput) {
            chatInput.focus();
          }
        }, 1000);
      }, 1000 + Math.random() * 2000);
      
      // Auto-scroll when typing starts
      setTimeout(() => {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
      }, 200);
      
      // Auto-scroll when typing indicator appears
      setTimeout(() => {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
      }, 150);
    }
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

  // Determine button text based on current question and submission status
  const getActionButtonText = () => {
    if (currentQuestion === 0) {
      return isSubmitted ? 'Next Question' : 'Check Answer';
    } else {
      return 'Finish Assignment';
    }
  };

  const [socraticComplete, setSocraticComplete] = useState(false);

  const canClickActionButton = () => {
    if (currentQuestion === 0) {
      if (!isSubmitted) {
        return limitAnswer.trim() !== '' && selectedJustification !== null;
      } else {
        return true; // Can proceed to next question
      }
    } else {
      // For Socratic Dialogue (Q2), check if understanding is 100% and socraticComplete is true
      return window.socraticUnderstandingScore === 100 && socraticComplete;
    }
  };

  const handleActionButton = () => {
    if (currentQuestion === 0) {
      if (!isSubmitted) {
        handleSubmit();
      } else {
        handleNextQuestion();
      }
    } else {
      // If socraticComplete, go home
      if (socraticComplete) {
        onNavigateHome();
      } else {
        handleNextQuestion(); // fallback
      }
    }
  };

  return (
    <div className="assignment-container">
      {/* Global Top Bar */}
      <div className="global-top-bar">
        <div className="top-bar-left">
          <button
            className="logo-button"
            onClick={onNavigateHome}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <span className="logo">superclassroom</span>
          </button>
        </div>
        
        <div className="top-bar-right">
          <button 
            className={`action-button ${canClickActionButton() ? 'active' : ''}`}
            onClick={handleActionButton}
            disabled={!canClickActionButton()}
          >
            {getActionButtonText()}
          </button>
          <img 
            src="/diamond-icon.png" 
            alt="AI Help" 
            className={`ai-help-icon-button ${currentQuestion === 1 ? 'disabled' : ''}`}
            onClick={handleShowTutor}
            title="Get AI Help"
            style={{ cursor: currentQuestion === 1 ? 'not-allowed' : 'pointer' }}
          />
          <button 
            className="back-button-small"
            onClick={onNavigateHome}
            title="Back"
          >
            ←
          </button>
        </div>
      </div>

      <div className="assignment-layout">
        {/* Sidebar */}
        <div className="assignment-sidebar">
          <div className="sidebar-header">
            <h3>Limits and Continuity</h3>
          </div>
          <div className="sidebar-content">
            <div className="grading-options">
              <div className="grading-item">
                <span>Unlimited attempts per question</span>
              </div>
              <div className="grading-item">
                <span>Get immediate feedback on each question</span>
              </div>
            </div>
            <div className="question-list">
              {Array.from({length: totalQuestions}, (_, i) => (
                <div key={i + 1} className={`question-item ${i === currentQuestion ? 'current' : ''}`}>
                  <span className="question-number">Q{i + 1}</span>
                  <span className="question-status">
                    {i === currentQuestion ? 'Current' : i < currentQuestion ? 'Completed' : 'Unanswered'}
                  </span>
                </div>
              ))}
            </div>
            <div className="sidebar-bottom">
              <button 
                className="sidebar-back-button"
                onClick={onNavigateHome}
                title="Back to Home"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        <main className="assignment-main">
          {/* Question Content */}
          {currentQuestion === 0 ? (
            /* Question 1: MCQ Limit Problem */
            <div className="problem-panel">
              <div className="problem-content">
                <div className="problem-header">
                  <h2>Evaluate the limit.</h2>
                  <p className="problem-instructions">
                    Give your answer in exact form. If the limit does not exist, enter DNE.
                  </p>
                </div>

                <div className="limit-problem">
                                  <div className="math-input-group">
                  <div className="math-expression">
                    <BlockMath math={limitExpression} />
                  </div>
                  <div className="equals-sign">=</div>
                  <input 
                    type="text" 
                    className={`limit-input ${isSubmitted && !isLimitCorrect ? 'incorrect-answer' : ''}`}
                    value={limitAnswer}
                    onChange={(e) => {
                      setLimitAnswer(e.target.value);
                      if (isSubmitted) {
                        handleRetryQuestion();
                      }
                    }}
                  />
                </div>
                </div>

                <div className="justification-section">
                  <h3 className="justification-title">Select the statement that justifies your answer</h3>
                  <div className="options-list">
                    {justificationOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`option-card ${selectedJustification === option.id ? 'selected' : ''} ${
                          isSubmitted && selectedJustification === option.id && option.id !== correctJustification ? 'incorrect' : ''
                        }`}
                        onClick={() => {
                          setSelectedJustification(option.id);
                          if (isSubmitted) {
                            handleRetryQuestion();
                          }
                        }}
                      >
                        <div className="option-letter">{option.id}</div>
                        <div className="option-content">
                          {option.text_start}
                          <InlineMath math={option.math} />
                          {option.text_end}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              
                {isSubmitted && isFullyCorrect && (
                  <div className="result-section">
                    <div className="success-message">
                      ✓ Perfect! You got it right.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Question 2: Socratic Dialogue */
            <div className="socratic-wrapper">
              <SocraticDialogue 
                onNavigateHome={onNavigateHome}
                onUnderstandingChange={(score) => {
                  window.socraticUnderstandingScore = score;
                  if (score === 100) setSocraticComplete(true);
                }}
              />
            </div>
          )}

          {/* AI Tutor Panel - Overlay */}
          {showChatbot && currentQuestion === 0 && (
            <div className="ai-tutor-panel">
              <div className="chatbot-header">
                <h3>Hello, Ronald</h3>
                <p>I'm here to guide you through this problem.</p>
                <button 
                  className="close-panel-btn"
                  onClick={() => setShowChatbot(false)}
                  title="Close"
                >
                  ×
                </button>
              </div>
              
                              <div className="chat-history" ref={chatHistoryRef}>
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`chat-message ${chat.sender}`}>
                    {chat.sender === 'ai' && <div className="ai-icon"></div>}
                    <div className="message-content">
                      {chat.sender === 'ai' ? (
                        // Render AI messages with math support
                        renderMathInText(chat.message).map((part, partIndex) => (
                          <span key={partIndex}>
                            {part.type === 'text' ? (
                              part.content
                            ) : (
                              part.isBlock ? (
                                <BlockMath math={part.content} />
                              ) : (
                                <InlineMath math={part.content} />
                              )
                            )}
                          </span>
                        ))
                      ) : (
                        // Student messages are plain text
                        chat.message
                      )}
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
    </div>
  );
};

export default Assignment; 