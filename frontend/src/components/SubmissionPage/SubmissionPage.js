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
      score: 95,
      status: 'graded',
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
          <button className="back-button" onClick={onNavigateBack}>
            <span className="material-icons">arrow_back</span>
            Back to Assignment
          </button>
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
        <button className="back-button" onClick={onNavigateBack}>
          <span className="material-icons">arrow_back</span>
          Back to Assignment
        </button>
        <div className="submission-header-info">
          <div className="submission-title-section">
            <div className="title-and-badge">
              <div className="assignment-badges">
                <span className="assignment-type-badge superconcept">
                  <span className="material-icons assignment-type-icon">article</span>
                  Superconcept
                </span>
                <span className={`assignment-type-badge ${submission.assignmentType.toLowerCase()}`}>
                  <span className="material-icons assignment-type-icon">
                    {submission.assignmentType.toLowerCase() === 'superquiz' ? 'edit' : 'article'}
                  </span>
                  {submission.assignmentType}
                </span>
              </div>
              <h1 className="submission-title">{submission.assignmentTitle}</h1>
              <p className="submission-student">Submission by {submission.studentName}</p>
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
          
          <div className="score-section">
            <div className="score-display">
              <div className={`score-circle ${getScoreColor(submission.score)}`}>
                <span className="score-value">{submission.score}%</span>
              </div>
            </div>
            <div className="score-details">
              <div className="score-title">Final Score</div>
              <div className="score-status">
                <span className={`status-badge ${submission.status}`}>
                  {submission.status === 'graded' ? 'Graded' : 'Pending'}
                </span>
              </div>
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

          <div className="attempts-section">
            <div className="meta-icon">
              <span className="material-icons">refresh</span>
            </div>
            <div className="meta-details">
              <div className="meta-title">Attempts</div>
              <div className="meta-value">{submission.attempts}</div>
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
                <h4>Attempts Used</h4>
                <div className="analytics-value">{submission.attempts}</div>
                <div className="analytics-trend positive">First attempt success</div>
              </div>
              <div className="analytics-card">
                <h4>Class Rank</h4>
                <div className="analytics-value">3rd</div>
                <div className="analytics-trend positive">Top 10%</div>
              </div>
              <div className="analytics-card">
                <h4>Time vs Class</h4>
                <div className="analytics-value">-6 min</div>
                <div className="analytics-trend positive">Faster than average</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPage;