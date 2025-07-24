import React, { useState, useRef, useEffect } from 'react';
import PartsSidebar from './components/PartsSidebar';
import PartContent from './components/PartContent';
import differentialEquationAssignment from './data/assignmentDefinitions';
import { updatePartLocks, canAccessPart, getNextAvailablePart } from './utils/progressUtils';
import './MultiPartAssignment.css';

const MultiPartAssignment = ({ onNavigateHome }) => {
  // Initialize parts state from assignment definition
  const initializeParts = () => {
    const initialParts = {};
    Object.keys(differentialEquationAssignment.parts).forEach(partId => {
      const partDef = differentialEquationAssignment.parts[partId];
      initialParts[partId] = {
        id: partId,
        title: partDef.title,
        completed: false,
        answer: partDef.inputType === 'multiple-choice' ? null : '',
        locked: partDef.dependsOn && partDef.dependsOn.length > 0,
        dependsOn: partDef.dependsOn || [],
        inputType: partDef.inputType
      };
    });
    return updatePartLocks(initialParts);
  };

  const [parts, setParts] = useState(initializeParts());
  const [currentPartId, setCurrentPartId] = useState('a');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatWidth, setChatWidth] = useState(400);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAITyping, setIsAITyping] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAITyping]);

  // Handle part selection from sidebar
  const handlePartSelect = (partId) => {
    if (canAccessPart(partId, parts)) {
      setCurrentPartId(partId);
      // Hide chat when switching parts
      setShowChatbot(false);
      setChatHistory([]);
    }
  };

  // Handle answer changes
  const handleAnswerChange = (partId, answer) => {
    setParts(prevParts => ({
      ...prevParts,
      [partId]: {
        ...prevParts[partId],
        answer: answer
      }
    }));
  };

  // Handle part completion
  const handlePartComplete = (partId, answer) => {
    setParts(prevParts => {
      const updatedParts = {
        ...prevParts,
        [partId]: {
          ...prevParts[partId],
          completed: true,
          answer: answer
        }
      };
      // Update locks after completion
      return updatePartLocks(updatedParts);
    });

    // Auto-advance to next available part
    setTimeout(() => {
      const nextPart = getNextAvailablePart(partId, parts);
      if (nextPart) {
        setCurrentPartId(nextPart);
      }
    }, 1500);
  };

  // Handle showing chat for help
  const handleShowChat = (partId, userAnswer) => {
    const partDef = differentialEquationAssignment.parts[partId];
    
    const initialMessage = `I see you're working on Part ${partId.toUpperCase()}: "${partDef.title}". ` +
      `You answered "${userAnswer}". Let me help you understand this problem step by step.`;

    setChatHistory([{
      sender: 'ai',
      message: initialMessage
    }]);
    
    setShowChatbot(true);
  };

  // Chat submit handler
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim() !== '' && !isAITyping) {
      setIsAITyping(true);
      setChatHistory(prev => ([
        ...prev,
        { sender: 'student', message: chatMessage }
      ]));
      setChatMessage('');

      // Generate AI response based on current part
      setTimeout(() => {
        const response = generateAIResponse(chatMessage, currentPartId);
        setChatHistory(prev => ([
          ...prev,
          { sender: 'ai', message: response }
        ]));
        setIsAITyping(false);
      }, 1000 + Math.random() * 2000);
    }
  };

  // Generate contextual AI responses
  const generateAIResponse = (userMessage, partId) => {
    const partDef = differentialEquationAssignment.parts[partId];
    const lowerMessage = userMessage.toLowerCase();

    // Part-specific responses
    switch (partId) {
      case 'a':
        if (lowerMessage.includes('laplace') || lowerMessage.includes('transform')) {
          return 'Great! For the Laplace transform, remember that L{y\'\'} = s²Y(s) - sy(0) - y\'(0) and L{y\'} = sY(s) - y(0). Also, L{e^(at)} = 1/(s-a). Try applying these formulas to your differential equation.';
        }
        if (lowerMessage.includes('initial')) {
          return 'Yes, the initial conditions y(0) = 1 and y\'(0) = 0 are crucial. They appear in the Laplace transform formulas for derivatives. Make sure to substitute these values correctly.';
        }
        return 'For this part, focus on applying the Laplace transform to both sides of the differential equation y\'\' - 4y\' + 4y = 12e^(2t), using the given initial conditions.';

      case 'b':
        if (lowerMessage.includes('solve') || lowerMessage.includes('algebra')) {
          return 'Good thinking! After applying the Laplace transform, you should have an algebraic equation in terms of Y(s). Collect all terms with Y(s) on one side and factor it out.';
        }
        return 'Once you have the transformed equation from part (a), rearrange it to solve for Y(s). This involves algebraic manipulation to isolate Y(s).';

      case 'g':
        if (lowerMessage.includes('graph') || lowerMessage.includes('behavior')) {
          return 'Think about the solution y(t) = e^(2t) + 6t²e^(2t). This has both exponential growth (e^(2t)) and polynomial growth (t²). The t² factor means the growth accelerates over time. Which graph shows this accelerating exponential behavior?';
        }
        return 'Consider the mathematical behavior of your solution. How does t²e^(2t) behave as t increases? Does it grow exponentially, and does the growth rate accelerate?';

      default:
        if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
          return `For part ${partId.toUpperCase()}, remember: ${partDef.instruction} Feel free to ask about specific steps you're having trouble with.`;
        }
        return `I'm here to help with part ${partId.toUpperCase()}. What specific aspect would you like me to explain?`;
    }
  };

  // Handle sidebar resizing
  const handleSidebarMouseDown = (e) => {
    setIsSidebarResizing(true);
    e.preventDefault();
  };

  const handleSidebarMouseMove = (e) => {
    if (!isSidebarResizing) return;
    
    const newSidebarWidth = e.clientX;
    const minWidth = 280;
    const maxWidth = 500;
    
    if (newSidebarWidth >= minWidth && newSidebarWidth <= maxWidth) {
      setSidebarWidth(newSidebarWidth);
    }
  };

  const handleSidebarMouseUp = () => {
    setIsSidebarResizing(false);
  };

  // Handle chat resizing
  const handleChatMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleChatMouseMove = (e) => {
    if (!isResizing) return;
    
    const containerWidth = window.innerWidth;
    const newChatWidth = containerWidth - e.clientX;
    
    const minWidth = 300;
    const maxWidth = containerWidth * 0.5;
    
    if (newChatWidth >= minWidth && newChatWidth <= maxWidth) {
      setChatWidth(newChatWidth);
    }
  };

  const handleChatMouseUp = () => {
    setIsResizing(false);
  };

  // Mouse event listeners for resizing
  useEffect(() => {
    if (isSidebarResizing) {
      document.addEventListener('mousemove', handleSidebarMouseMove);
      document.addEventListener('mouseup', handleSidebarMouseUp);
    } else {
      document.removeEventListener('mousemove', handleSidebarMouseMove);
      document.removeEventListener('mouseup', handleSidebarMouseUp);
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleChatMouseMove);
      document.addEventListener('mouseup', handleChatMouseUp);
    } else {
      document.removeEventListener('mousemove', handleChatMouseMove);
      document.removeEventListener('mouseup', handleChatMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleSidebarMouseMove);
      document.removeEventListener('mouseup', handleSidebarMouseUp);
      document.removeEventListener('mousemove', handleChatMouseMove);
      document.removeEventListener('mouseup', handleChatMouseUp);
    };
  }, [isSidebarResizing, isResizing]);

  const currentPart = parts[currentPartId];

  return (
    <div 
      className={`multi-part-container ${isSidebarResizing || isResizing ? 'resizing' : ''}`}
      style={{
        '--sidebar-width': `${sidebarWidth}px`,
        '--chat-width': `${chatWidth}px`
      }}
    >
      {/* Parts Sidebar */}
      <PartsSidebar
        parts={parts}
        currentPartId={currentPartId}
        onPartSelect={handlePartSelect}
        assignmentTitle={differentialEquationAssignment.title}
        assignmentDescription={differentialEquationAssignment.description}
      />

      {/* Sidebar Divider */}
      <div 
        className={`sidebar-divider ${isSidebarResizing ? 'resizing' : ''}`}
        onMouseDown={handleSidebarMouseDown}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        <div className="centered-content-wrapper">
          <PartContent
            part={currentPart}
            assignmentDefinition={differentialEquationAssignment}
            onAnswerChange={handleAnswerChange}
            onPartComplete={handlePartComplete}
            onShowChat={handleShowChat}
          />
        </div>
      </div>

      {/* Chat Divider - only show when chatbot is visible */}
      {showChatbot && (
        <div 
          className={`chat-divider ${isResizing ? 'resizing' : ''}`}
          onMouseDown={handleChatMouseDown}
        />
      )}

      {/* Chat Sidebar */}
      {showChatbot && (
        <div className="chat-sidebar" style={{ width: chatWidth }}>
          <div className="chat-header">
            <h3>Assignment Helper</h3>
            <p>I'm here to guide you through this problem.</p>
            <button 
              className="close-chat-button"
              onClick={() => setShowChatbot(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`chat-message ${chat.sender}`}>
                <div className="message-content">
                  {chat.message}
                </div>
              </div>
            ))}
            
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
              placeholder="Ask for help with this part..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={isAITyping}
            />
            <button type="submit" className="chat-send-button" disabled={isAITyping}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MultiPartAssignment; 