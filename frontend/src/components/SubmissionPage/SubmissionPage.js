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
      courseTitle: 'Biology 101',
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
          <p>Alice <span className="highlight-green">demonstrated excellent understanding of continuity</span> and <span className="highlight-green">correctly identified removable discontinuities</span>. She <span className="highlight-green">showed strong intuition for limit behavior</span> and <span className="highlight-green">effectively used graphical reasoning</span> to support her solutions.</p>
        </div>
        
        <div className="areas-improvement-section">
          <h4>Areas of Improvement</h4>
          <p>Alice <span className="highlight-orange">needs more practice with indeterminate forms</span> in problem 3. She <span className="highlight-orange">struggled with L'Hôpital's rule applications</span> and <span className="highlight-orange">could improve her formal limit proofs</span> for more complex functions.</p>
        </div>
        
        <div className="superscore-section">
                      <div className="superscore-main">
              <div className="superscore-circle-large superscore-excellent">
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
            AI Log
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
            <div className="ai-log-section">
              <h3>AI Processing Log</h3>
              <div className="log-entries">
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:46 PM</div>
                  <div className="log-type analysis">Analysis</div>
                  <div className="log-message">Started automated evaluation of student submission for "Limits and Continuity"</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:46 PM</div>
                  <div className="log-type processing">Processing</div>
                  <div className="log-message">Analyzing mathematical notation and problem-solving approach</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:46 PM</div>
                  <div className="log-type validation">Validation</div>
                  <div className="log-message">Validated algebraic steps: factorization (x² - 4) = (x + 2)(x - 2) ✓</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:46 PM</div>
                  <div className="log-type validation">Validation</div>
                  <div className="log-message">Confirmed limit evaluation: lim(x→2) = 4 ✓</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:47 PM</div>
                  <div className="log-type insight">Insight</div>
                  <div className="log-message">Generated strength analysis: Excellent recognition of indeterminate form</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:47 PM</div>
                  <div className="log-type insight">Insight</div>
                  <div className="log-message">Identified improvement area: Could mention alternative approaches</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:47 PM</div>
                  <div className="log-type score">Scoring</div>
                  <div className="log-message">AI Superscore calculated: 93.5/100 based on rubric criteria</div>
                </div>
                <div className="log-entry">
                  <div className="log-timestamp">2024-01-14 3:47 PM</div>
                  <div className="log-type complete">Complete</div>
                  <div className="log-message">AI analysis completed. Ready for instructor review.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPage;