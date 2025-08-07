import React, { useState, useEffect } from 'react';
import './SubmissionPage.css';

const SubmissionPage = ({ submissionId, assignmentId, onNavigateBack }) => {
  // Mock submission data - in real app this would come from API
  const submissionData = {
    1: {
      studentName: 'Alice Brown',
      studentEmail: 'alice.brown@email.com',
      submissionId: 'SUB-001',
      assignmentTitle: 'Limits and Continuity',
      assignmentType: 'Superquiz',
      courseTitle: 'Calculus I',
      submittedDate: '2024-01-14 3:45 PM',
      score: null,
      status: 'pending',
      timeSpent: '18 minutes',
      attempts: 1,
      submission: {
        content: [
          {
            type: 'text',
            question: 'Problem 1: Evaluate the following limit using the definition of a limit.',
            answer: 'To find the limit of (x² - 4)/(x - 2) as x approaches 2, I will use algebraic manipulation to resolve the indeterminate form.'
          },
          {
            type: 'math',
            question: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}',
            answer: 'First, I factor the numerator: x² - 4 = (x + 2)(x - 2)\n\nSo the expression becomes:\n\\lim_{x \\to 2} \\frac{(x + 2)(x - 2)}{(x - 2)}\n\nSince x ≠ 2, I can cancel the (x - 2) terms:\n\\lim_{x \\to 2} (x + 2)\n\nNow I can substitute x = 2:\n2 + 2 = 4\n\nTherefore, the limit is 4.'
          },
          {
            type: 'text',
            question: 'Show all steps in your solution and explain your reasoning.',
            answer: 'The key insight is recognizing that this is an indeterminate form (0/0) when we substitute x = 2 directly. By factoring the numerator and canceling common terms, we remove the discontinuity and can evaluate the limit directly. This demonstrates that even though the function is undefined at x = 2, the limit exists and equals 4.'
          }
        ]
      },
      feedback: {
        overallComment: 'Excellent work! Your solution demonstrates a clear understanding of limit evaluation techniques.',
        strengths: [
          'Correctly identified the indeterminate form',
          'Proper algebraic manipulation and factoring',
          'Clear step-by-step presentation',
          'Good explanation of reasoning'
        ],
        improvements: [
          'Could include a brief mention of L\'Hôpital\'s rule as an alternative approach'
        ],
        rubricScores: [
          { criterion: 'Mathematical Accuracy', score: 10, maxScore: 10 },
          { criterion: 'Problem-Solving Process', score: 9, maxScore: 10 },
          { criterion: 'Communication', score: 9, maxScore: 10 },
          { criterion: 'Understanding of Concepts', score: 10, maxScore: 10 }
        ]
      }
    }
  };

  const submission = submissionData[submissionId];
  const [activeTab, setActiveTab] = useState('submission');
  const [showSuperscoreModal, setShowSuperscoreModal] = useState(false);
  const [showStruggleDropdown, setShowStruggleDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [dropdownFadeIn, setDropdownFadeIn] = useState(false);

  // Struggle examples data
  const struggleExamples = [
    {
      quote: "Maybe a jump? Or like a hole in the graph?",
      highlightedText: "hole in the graph"
    },
    {
      quote: "The function goes crazy when x approaches 0 from the left side.",
      highlightedText: "goes crazy"
    },
    {
      quote: "I think the limit is getting close to 3, but I'm not sure if it actually reaches it.",
      highlightedText: "getting close to 3"
    },
    {
      quote: "The graph looks broken at x = 2, so maybe it's not continuous there?",
      highlightedText: "looks broken"
    }
  ];

  // Scroll to top when component mounts or submissionId changes
  useEffect(() => {
    const scrollToTop = () => {
      // Account for the 60px margin-top and header offset
      const targetScrollPosition = 0;
      
      // Force scroll to absolute top using multiple methods
      window.scrollTo(0, targetScrollPosition);
      document.documentElement.scrollTop = targetScrollPosition;
      document.body.scrollTop = targetScrollPosition;
      
      // For modern browsers
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = targetScrollPosition;
      }
      
      // Try scrolling to the back button (should be the very top visible element)
      const backButton = document.querySelector('.back-button');
      if (backButton) {
        backButton.scrollIntoView({ 
          behavior: 'auto', 
          block: 'start',
          inline: 'nearest' 
        });
        
        // Then scroll up a bit more to account for any margins/padding
        window.scrollBy(0, -20);
      }
      
      // Final aggressive scroll to ensure we're at the top
      window.scroll(0, 0);
      document.documentElement.scrollTop = 0;
    };

    // Multiple attempts to ensure scroll works across all browsers and timing scenarios
    scrollToTop();
    requestAnimationFrame(scrollToTop);
    setTimeout(scrollToTop, 1);
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 200);
  }, [submissionId]);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.struggle-dropdown') && 
          !event.target.closest('.struggle-trigger')) {
        setShowStruggleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  if (!submission) {
    return (
      <div className="submission-page">
        <div className="submission-page-header">
        </div>
        <div className="submission-page-content">
          <div className="submission-not-found">
            <h2>Submission not found</h2>
            <p>The submission you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'needs-improvement';
  };

  const getTotalRubricScore = () => {
    return submission.feedback.rubricScores.reduce((total, item) => total + item.score, 0);
  };

  const getTotalMaxScore = () => {
    return submission.feedback.rubricScores.reduce((total, item) => total + item.maxScore, 0);
  };

  // Hover handler functions for struggle dropdown
  const handleStruggleHover = (e) => {
    const rect = e.target.getBoundingClientRect();
    const dropdownWidth = 400;
    const dropdownHeight = 300;
    
    let x = rect.left;
    let y = rect.bottom + 5;
    
    // Adjust if would go off right edge
    if (x + dropdownWidth > window.innerWidth) {
      x = window.innerWidth - dropdownWidth - 10;
    }
    
    // Adjust if would go off bottom edge
    if (y + dropdownHeight > window.innerHeight) {
      y = rect.top - dropdownHeight - 5;
    }
    
    setDropdownPosition({ x, y });
    // Add a 0.2 second delay before showing the dropdown
    const timeout = setTimeout(() => {
      setShowStruggleDropdown(true);
      setDropdownFadeIn(true);
    }, 200); // 200ms delay
    setDropdownTimeout(timeout);
  };

  const handleStruggleLeave = () => {
    // Cancel the show timeout if leaving before 1s
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    // Set a timeout to close the dropdown after a short delay
    const timeout = setTimeout(() => {
      setShowStruggleDropdown(false);
      setDropdownFadeIn(false);
    }, 150); // 150ms delay
    setDropdownTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    // Clear timeout when entering dropdown
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowStruggleDropdown(true);
    setDropdownFadeIn(true);
  };

  const handleDropdownLeave = () => {
    // Set timeout to close dropdown when leaving
    const timeout = setTimeout(() => {
      setShowStruggleDropdown(false);
      setDropdownFadeIn(false);
    }, 150); // 150ms delay
    setDropdownTimeout(timeout);
  };

  return (
    <div className="submission-page">
      <div className="submission-page-header">
        <div className="submission-header-info">
          <div className="submission-title-section">
            <div className="title-and-badge">
              <h1 className="submission-title">{submission.studentName}'s</h1>
              <p className="submission-student">Submission for Limits and Continuity</p>
            </div>
            <div className="header-actions">
              <button className="action-button secondary">
                <span className="material-icons">download</span>
                Export
              </button>
              <button className="action-button primary">
                <span className="material-icons">edit</span>
                Edit Grade
              </button>
            </div>
          </div>
          <p className="assignment-course">{submission.courseTitle}</p>
        </div>

        <div className="submission-meta">
          <div className="submitted-date-section">
            <div className="meta-icon">
              <span className="material-icons">schedule</span>
            </div>
            <div className="meta-details">
              <div className="meta-title">Submitted</div>
              <div className="meta-value">{formatDate(submission.submittedDate)}</div>
            </div>
          </div>
          


          <div className="time-section">
            <div className="meta-icon">
              <span className="material-icons">timer</span>
            </div>
            <div className="meta-details">
              <div className="meta-title">Time Spent</div>
              <div className="meta-value">{submission.timeSpent}</div>
            </div>
          </div>


        </div>
      </div>

      <div className="performance-summary-section">
        <div className="performance-header">
          <span className="material-icons">assessment</span>
          <h3>Performance Summary</h3>
        </div>
        
        <div className="strengths-section">
          <h4>Strengths</h4>
          <p>Alice <span className="highlight-green">demonstrated strong intuitive understanding</span> and <span className="highlight-green">showed excellent pattern recognition</span>. She consistently<span className="highlight-green">built on previous concepts</span>, with many responses <span className="highlight-green">connecting geometric and analytical perspective</span> effectively.</p>
        </div>
        
        <div className="areas-improvement-section">
          <h4>Areas of Improvement</h4>
          <p>Alice <span 
            className="highlight-orange struggle-trigger"
            onMouseEnter={handleStruggleHover}
            onMouseLeave={handleStruggleLeave}
          >
            struggled with precise mathematical terminology
          </span>. Many responses <span className="highlight-orange">showed hesitation with formal definitions</span> and <span className="highlight-orange">provided incomplete explanations</span> for their reasoning about discontinuity types.</p>
        </div>
        
        <div className="superscore-section">
                      <div className="superscore-main">
              <div 
                className="superscore-circle-large superscore-excellent"
                onClick={() => setShowSuperscoreModal(true)}
                style={{ cursor: 'pointer' }}
              >
                <svg className="superscore-progress" width="120" height="120" viewBox="0 0 120 120">
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="54" 
                    fill="transparent" 
                    stroke="#e9ecef" 
                    strokeWidth="6"
                  />
                  <circle 
                    className="superscore-progress-circle"
                    cx="60" 
                    cy="60" 
                    r="54" 
                    fill="transparent" 
                    stroke="#90EE90" 
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="339.292"
                    strokeDashoffset="339.292"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className="superscore-number-large">8.8</span>
              </div>
              <div className="superscore-summary">
                <h4>AI Usage Superscore®</h4>
                <p>This student was able to use the AI effectively to walk through the assignment.</p>
              </div>
            </div>
        </div>
      </div>

      {/* Struggle Dropdown */}
      {showStruggleDropdown && (
        <div 
          className={`struggle-dropdown${dropdownFadeIn ? ' fade-in' : ''}`}
          style={{
            position: 'absolute',
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`,
            zIndex: 1000
          }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="struggle-dropdown-content">
            <div className="dropdown-header" style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
              Alice Brown's chat logs
            </div>
            {struggleExamples.map((example, index) => (
              <div key={index} className="struggle-example">
                <div className="chat-bubble">
                  <div 
                    className="student-quote"
                    dangerouslySetInnerHTML={{
                      __html: `"${example.quote.replace(
                        example.highlightedText,
                        `<span class=\"highlighted-text\">${example.highlightedText}</span>`
                      )}"`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="submission-page-tabs">
        <div className="submission-page-tabs-inner">
          <button 
            className={`tab-button ${activeTab === 'submission' ? 'active' : ''}`}
            onClick={() => setActiveTab('submission')}
          >
            Submission
          </button>
          <button 
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback & Grading
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`tab-button ${activeTab === 'ai-log' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-log')}
          >
            AI History
          </button>
        </div>
      </div>

      <div className="submission-page-content">
        {activeTab === 'submission' && (
          <div className="submission-content">
            <div className="content-section">
              <h3>Student Response</h3>
              <div className="submission-responses">
                {submission.submission.content.map((item, index) => (
                  <div key={index} className="response-item">
                    <div className="question-section">
                      <h4 className="question-title">Question {index + 1}</h4>
                      <div className={`question-content ${item.type}`}>
                        {item.type === 'text' && <p>{item.question}</p>}
                        {item.type === 'math' && (
                          <div className="math-content">
                            <code>{item.question}</code>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="answer-section">
                      <h5 className="answer-title">Student Answer</h5>
                      <div className="answer-content">
                        {item.type === 'math' && item.answer.includes('\\') ? (
                          <div className="math-answer">
                            <pre>{item.answer}</pre>
                          </div>
                        ) : (
                          <p>{item.answer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-content">
            <div className="content-section">
              <h3>Overall Feedback</h3>
              <div className="feedback-comment">
                <p>{submission.feedback.overallComment}</p>
              </div>
            </div>

            <div className="feedback-sections">
              <div className="feedback-section strengths">
                <h4 className="feedback-title">Strengths</h4>
                <ul className="feedback-list">
                  {submission.feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-section improvements">
                <h4 className="feedback-title">Areas for Improvement</h4>
                <ul className="feedback-list">
                  {submission.feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="content-section">
              <h3>Rubric Scores</h3>
              <div className="rubric-scores">
                {submission.feedback.rubricScores.map((rubric, index) => (
                  <div key={index} className="rubric-item">
                    <div className="rubric-criterion">
                      <span className="criterion-name">{rubric.criterion}</span>
                      <span className="criterion-score">{rubric.score}/{rubric.maxScore}</span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${(rubric.score / rubric.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="rubric-total">
                  <div className="total-score">
                    <span>Total Score: {getTotalRubricScore()}/{getTotalMaxScore()}</span>
                    <span className="total-percentage">({Math.round((getTotalRubricScore() / getTotalMaxScore()) * 100)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Completion Time</h4>
                <div className="analytics-value">{submission.timeSpent}</div>
                <div className="analytics-trend neutral">Average for assignment</div>
              </div>
              <div className="analytics-card">
                <h4>Submission Status</h4>
                <div className="analytics-value">Pending</div>
                <div className="analytics-trend neutral">Awaiting grading</div>
              </div>
              <div className="analytics-card">
                <h4>Class Rank</h4>
                <div className="analytics-value">-</div>
                <div className="analytics-trend neutral">Not yet ranked</div>
              </div>
              <div className="analytics-card">
                <h4>Time vs Class</h4>
                <div className="analytics-value">-</div>
                <div className="analytics-trend neutral">Analysis pending</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-log' && (
          <div className="ai-log-content">
            <div className="ai-history-section">
              <h3>Alice Brown's Chat History</h3>
              <div className="transcript-content plain-text-transcript">
                <div><span className="speaker user">Alice</span><br />I think that for ODEs, it is important that our general solution is <span className="strength">linearly independent so that it can capture the full behavior of the ODE, and therefore get the right solution</span></div>
                <div><span className="speaker superclassroom">AI</span><br />Excellent! You've touched on something really important - that <span className="strength">linear independence helps us "capture the full behavior" of the differential equation</span>.
<br /><br />Let me ask you this: What does it mean mathematically for a second-order differential equation to have "full behavior"? In other words, how many independent pieces of information do you think we need to completely describe all possible solutions?</div>
                <div><span className="speaker user">Alice</span><br /><span className="weakness">It means that our general solution is the correct representation of the differential equations?</span> <span className="weakness">I'm not entirely sure</span>. I'm guessing two, but I'm also not entirely sure why.</div>
                <div><span className="speaker superclassroom">AI</span><br />Good instinct on the "<span className="strength">two</span>"! You're absolutely right for second-order equations.<br /><br />Here's a way to think about it: If I gave you a second-order differential equation and said "find the specific solution," what additional information would I need to give you to pin down exactly which solution I want?</div>
                <div><span className="speaker user">Alice</span><br />The differential equation?</div>
                <div><span className="speaker superclassroom">AI</span><br />Well, I'd give you the differential equation, of course! But think about this scenario: suppose I tell you the differential equation is y'' - 4y' + 4y = 0.<br /><br />Now, there are infinitely many functions that satisfy this equation. So if I want you to find one specific solution - not just any solution, but the exact one I have in mind - what extra information would I need to provide?</div>
                <div><span className="speaker user">Alice</span><br /><span className="weakness-red" title="Potential misuse: Student requested direct answer instead of working through the problem">Just give me the answer.</span></div>
                <div><span className="speaker superclassroom">AI</span><br />You're almost there! What extra information would I need to provide?</div>
                <div><span className="speaker user">Alice</span><br /><span className="strength">Initial conditions</span>?</div>
                <div><span className="speaker superclassroom">AI</span><br />Exactly! <span className="strength">Initial conditions</span>. And for a second-order equation, how many initial conditions do you think I'd typically need to give you?<br />Once you answer that, I think we'll start to see why that number "<span className="strength">two</span>" you guessed earlier is so important...</div>
                <div><span className="speaker user">Alice</span><br />two</div>
                <div><span className="speaker superclassroom">AI</span><br />Perfect! So we need <span className="strength">two initial conditions to pin down a unique solution to a second-order differential equation</span>.<br /><br />Now here's the key connection: If our general solution has two arbitrary constants - like y = c₁y₁ + c₂y₂ - and we have two initial conditions, we can solve for those constants and get our specific solution.<br /><br />But what do you think would happen if y₁ and y₂ weren't linearly independent? What would that mean for our ability to satisfy any given pair of initial conditions?</div>
                <div><span className="speaker user">Alice</span><br />We can't satisfy them, since we would only have <span className="weakness">constant</span>?</div>
                <div><span className="speaker superclassroom">AI</span><br />Exactly! You only have one effective constant instead of two.<br />Now here's the critical question: If you have only one constant to determine, but you need to satisfy two initial conditions, what's the problem?</div>
                <div><span className="speaker user">Alice</span><br />The problem is that we can only apply <span className="weakness">one initial condition</span></div>
                <div><span className="speaker superclassroom">AI</span><br />Close! Actually, you can still apply both initial conditions - you can still write down the two equations.<br />But here's the real issue: what happens when you try to solve that system of two equations but you only have one unknown constant?</div>
                <div><span className="speaker user">Alice</span><br /><span className="weakness">I'm not sure</span></div>
                <div><span className="speaker superclassroom">AI</span><br />Think about it this way: you'd have two equations but only one unknown.<br />In general, what happens when you have more equations than unknowns in a system? Is such a system always guaranteed to have a solution?</div>
                <div><span className="speaker user">Alice</span><br />There's no solution!</div>
                <div><span className="speaker superclassroom">AI</span><br />Exactly! Most of the time there's no solution - the system is <span className="strength">overdetermined</span>.<br /><br />So this connects back to your original insight about "capturing the full behavior." If your functions aren't linearly independent, you can't satisfy arbitrary initial conditions, which means you're missing some of the possible behaviors of the differential equation.<br /><br />Now, can you see why repeated roots create a special problem? What would happen if you tried to use e^(2x) and e^(2x) as your two "solutions" for a repeated root r = 2?</div>
                <div><span className="speaker user">Alice</span><br />Well, you're going to make a <span className="strength">linearly dependent general solution. Or, in other words, you're gonna get a solution with no way to incorporate all initial conditions</span>.</div>
                <div><span className="speaker superclassroom">AI</span><br />Beautifully put! You've connected all the pieces.<br />Now, try answering the original question again: Why do you think linear independence is important for general solutions when dealing with repeated roots in ODEs?<br />Go ahead and give me your full understanding now - I'm excited to hear how you'd explain it!</div>
                <div><span className="speaker user">Alice</span><br />In order to solve for a specific solution of an ODE, especially when using the characteristic equation method & finding repeated roots, ensuring <span className="strength">linear independence in the constructed general solution is necessary for applying initial condition constraints—without it, you would be creating a system of equations that is overdetermined that cannot be solved! In other words, the general solution can not fully capture the entire behavior of the original differential equation</span>.</div>
                <div><span className="speaker superclassroom">AI</span><br />Excellent! You've absolutely nailed it. You've connected all the key pieces:<br />The need for enough independent constants to match the number of initial conditions<br />How repeated roots create the risk of linear dependence<br />The mathematical consequence - an overdetermined system<br />The bigger picture - that we need to capture the full solution space<br />This is exactly the kind of deep understanding that will serve you well. You've moved from a vague sense that "we need the right solution" to a precise understanding of why linear independence is mathematically necessary.</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Superscore Modal */}
      {showSuperscoreModal && (
        <div className="modal-overlay" onClick={() => setShowSuperscoreModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-small"
              onClick={() => setShowSuperscoreModal(false)}
            >
              <span className="material-icons">close</span>
            </button>
            
            <div className="modal-body">
              <div className="modal-layout">
                <div className="modal-superscore-circle">
                  <svg className="superscore-progress-modal" width="200" height="200" viewBox="0 0 200 200">
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="90" 
                      fill="transparent" 
                      stroke="#e9ecef" 
                      strokeWidth="8"
                    />
                    <circle 
                      className="superscore-progress-circle-modal"
                      cx="100" 
                      cy="100" 
                      r="90" 
                      fill="transparent" 
                      stroke="#90EE90" 
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="565.487"
                      strokeDashoffset="565.487"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <span className="superscore-number-modal">8.8</span>
                </div>
                
                <div className="modal-breakdown">
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <span className="material-icons">timer</span>
                      Time Spent on Model
                    </div>
                    <div className="breakdown-score time-spent">18 min</div>
                    <div className="breakdown-description">
                      Alice spent appropriate time engaging with the AI model, showing thoughtful interaction.
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <span className="material-icons">chat</span>
                      Prompt Quality
                    </div>
                    <div className="breakdown-score prompt-quality">Good</div>
                    <div className="breakdown-description">
                      Demonstrated excellent prompt engineering with clear, specific questions and follow-ups.
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <span className="material-icons">warning</span>
                      Misuse Flags
                    </div>
                    <div className="breakdown-score misuse-flags">1 Flag</div>
                    <div className="breakdown-description">
                      Clean interaction with no misuse detection flags raised during the session.
                    </div>
                  </div>
                  
                  <div className="breakdown-item">
                    <div className="breakdown-label">
                      <span className="material-icons">forum</span>
                      Depth of Conversation
                    </div>
                    <div className="breakdown-score depth-conversation">Good</div>
                    <div className="breakdown-description">
                      Showed deep engagement with multi-turn conversations and detailed follow-up questions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;