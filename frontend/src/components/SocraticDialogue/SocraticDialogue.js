import React, { useState } from 'react';
import './SocraticDialogue.css';

const SocraticDialogue = ({ onNavigateHome }) => {
  const [initialResponse, setInitialResponse] = useState('');
  const [hasSubmittedInitial, setHasSubmittedInitial] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const conceptualQuestion = "Why do you think linear independence is important for general solutions when dealing with repeated roots in ODEs?";

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
      const aiResponse = getAIResponse(chatMessage, chatHistory.length);
      
      // Add new messages to chat history
      const newMessages = [
        { sender: 'student', message: chatMessage },
        { sender: 'ai', message: aiResponse }
      ];
      
      setChatHistory([...chatHistory, ...newMessages]);
      setChatMessage('');
    }
  };

  const handleBackToHome = () => {
    onNavigateHome();
  };

  return (
    <div className="socratic-container">
      <header className="socratic-header">
        <div className="logo">superclassroom</div>
        <button className="back-button" onClick={handleBackToHome}>
          ← Back to Home
        </button>
      </header>
      
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
          </div>
        )}

        {/* Chat Phase */}
        {showChat && (
          <div className="socratic-chat-container">
            <div className="chat-header">
              <h3>Socratic Exploration</h3>
              <p>Let's explore this concept together through questions and dialogue.</p>
            </div>
            
            <div className="chat-history">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.sender}`}>
                  <div className="message-content">
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>
            
            <form className="chat-input-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                className="chat-input"
                placeholder="Continue the dialogue..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-button">
                Send
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default SocraticDialogue; 