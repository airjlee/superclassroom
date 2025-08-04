import React, { useState, useEffect } from 'react';
import './AssignmentPage.css';

const AssignmentPage = ({ assignmentId, courseId, onNavigateBack, onNavigateToSubmission }) => {
  // Mock assignment data - in real app this would come from API based on assignmentId
  const assignmentData = {
    1: {
      title: 'Limits and Continuity',
      type: 'Superquiz',
      courseTitle: 'Biology 101',
      description: 'This assignment covers the fundamental concepts of limits and continuity in calculus.',
      startDate: '2024-01-10',
      dueDate: '2024-01-15',
      totalStudents: 28,
      submissionsCount: 23,
      instructions: 'Complete all problems showing your work. Use proper mathematical notation.',
      content: [
        {
          type: 'text',
          content: 'Problem 1: Evaluate the following limit using the definition of a limit.'
        },
        {
          type: 'math',
          content: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}'
        },
        {
          type: 'text',
          content: 'Show all steps in your solution and explain your reasoning.'
        }
      ]
    },
    2: {
      title: 'Derivative Rules',
      type: 'Superconcept',
      courseTitle: 'Biology 101',
      description: 'Understanding and applying basic derivative rules including power rule, product rule, and chain rule.',
      startDate: '2024-01-12',
      dueDate: '2024-01-18',
      totalStudents: 28,
      submissionsCount: 25,
      instructions: 'Apply the appropriate derivative rules for each problem.',
      content: [
        {
          type: 'text',
          content: 'Find the derivative of each function using the appropriate rules.'
        },
        {
          type: 'math',
          content: 'f(x) = x^3 + 2x^2 - 5x + 1'
        },
        {
          type: 'text',
          content: 'Show your work and identify which rule you used for each term.'
        }
      ]
    },
    3: {
      title: 'Chain Rule Practice',
      type: 'Superquiz',
      courseTitle: 'Biology 101',
      description: 'Practice problems focusing specifically on the chain rule for composite functions.',
      startDate: '2024-01-15',
      dueDate: '2024-01-22',
      totalStudents: 28,
      submissionsCount: 20,
      instructions: 'Use the chain rule to find derivatives of composite functions.',
      content: [
        {
          type: 'text',
          content: 'Use the chain rule to find the derivative of:'
        },
        {
          type: 'math',
          content: 'g(x) = \\sin(x^2 + 1)'
        },
        {
          type: 'text',
          content: 'Remember: (f(g(x)))\\prime = f\\prime(g(x)) \\cdot g\\prime(x)'
        }
      ]
    },
    4: {
      title: 'Integration Basics',
      type: 'Superconcept',
      courseTitle: 'Biology 101',
      description: 'Introduction to integration as the reverse of differentiation.',
      startDate: '2024-01-20',
      dueDate: '2024-01-25',
      totalStudents: 28,
      submissionsCount: 0,
      instructions: 'Complete the integration problems using basic antiderivative rules.',
      content: [
        {
          type: 'text',
          content: 'Find the indefinite integral:'
        },
        {
          type: 'math',
          content: '\\int (3x^2 + 2x - 1) dx'
        },
        {
          type: 'text',
          content: 'Remember to include the constant of integration (+C).'
        }
      ]
    }
  };

  const assignment = assignmentData[assignmentId];
  const [activeTab, setActiveTab] = useState('submissions');

  // Scroll to top when component mounts or assignmentId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [assignmentId]);

  if (!assignment) {
    return (
      <div className="assignment-page">
        <div className="assignment-page-header">
          <button className="back-button" onClick={onNavigateBack}>
            <span className="material-icons">arrow_back</span>
            Back to Course
          </button>
        </div>
        <div className="assignment-page-content">
          <div className="assignment-not-found">
            <h2>Assignment not found</h2>
            <p>The assignment you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const getSubmissionStatus = () => {
    const percentage = assignment.submissionsCount / assignment.totalStudents;
    if (assignment.submissionsCount === assignment.totalStudents) return 'complete';
    if (percentage >= 0.5) return 'partial';
    return 'low';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getDueDateMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDueDateDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const getSubmissionPercentage = () => {
    return Math.round((assignment.submissionsCount / assignment.totalStudents) * 100);
  };

  const handleViewSubmission = (studentName, submissionId) => {
    // Scroll to top when View button is clicked
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    
    if (onNavigateToSubmission) {
      onNavigateToSubmission(submissionId, assignmentId, studentName);
    }
  };

  return (
    <div className="assignment-page">
      <div className="assignment-page-header">
        <div className="assignment-header-info">
          <div className="assignment-title-section">
            <div className="title-and-badge">
              <div className="assignment-badges">
                <span className="assignment-type-badge superconcept">
                  <span className="material-icons assignment-type-icon">article</span>
                  Superconcept
                </span>
                <span className={`assignment-type-badge ${assignment.type.toLowerCase()}`}>
                  <span className="material-icons assignment-type-icon">
                    {assignment.type.toLowerCase() === 'superquiz' ? 'edit' : 'article'}
                  </span>
                  {assignment.type}
                </span>
              </div>
              <h1 className="assignment-title">{assignment.title}</h1>
            </div>
            <div className="header-actions">
              <button className="action-button secondary">
                <span className="material-icons">edit</span>
                Edit
              </button>
              <button className="action-button primary">
                <span className="material-icons">share</span>
                Share
              </button>
            </div>
          </div>
          <p className="assignment-course">{assignment.courseTitle}</p>
          <p className="assignment-description">{assignment.description}</p>
        </div>

        <div className="assignment-meta">
          <div className="due-date-section">
            <div className="due-date-calendar">
              <div className="due-date-month">{getDueDateMonth(assignment.dueDate)}</div>
              <div className="due-date-day">{getDueDateDay(assignment.dueDate)}</div>
            </div>
            <div className="due-date-details">
              <div className="due-date-title">{formatDate(assignment.dueDate)}</div>
              <div className="due-date-time">11:59 PM</div>
            </div>
          </div>
          <div className="submissions-section">
            <div className="submissions-box">
              <div className="progress-circle">
                <svg className="progress-ring" width="40" height="40">
                  <circle
                    className="progress-ring-circle-bg"
                    stroke="#e9ecef"
                    strokeWidth="3"
                    fill="transparent"
                    r="18"
                    cx="20"
                    cy="20"
                  />
                  <circle
                    className="progress-ring-circle"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    fill="transparent"
                    r="18"
                    cx="20"
                    cy="20"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 18}`,
                      strokeDashoffset: `${2 * Math.PI * 18 * (1 - getSubmissionPercentage() / 100)}`
                    }}
                  />
                </svg>
                <div className="progress-percentage">{getSubmissionPercentage()}%</div>
              </div>
            </div>
            <div className="submissions-details">
              <div className="submissions-title">Submissions</div>
              <div className="submissions-count">{assignment.submissionsCount} of {assignment.totalStudents}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="activity-analytics">
        <div className="analytics-header">
          <span className="material-icons">analytics</span>
          <h3>Performance Summary</h3>
        </div>
        <div className="analytics-content">
          <div className="analytics-column strengths">
            <h4 className="analytics-title">Strengths</h4>
            <p>
              Most students <span className="highlight-green">correctly applied the limit definition</span> and 
              <span className="highlight-green">showed clear step-by-step work</span>. Several students 
              <span className="highlight-green">demonstrated strong algebraic manipulation skills</span>, 
              with many <span className="highlight-green">providing detailed explanations of their reasoning</span>.
            </p>
          </div>
          <div className="analytics-column improvements">
            <h4 className="analytics-title">Areas of Improvement</h4>
            <p>
              Most students <span className="highlight-orange">struggled with factoring techniques</span>. 
              Many students <span className="highlight-orange">showed confusion with limit notation</span> and 
              <span className="highlight-orange">provided incomplete justifications</span> for their final answers.
            </p>
          </div>
        </div>
      </div>

      <div className="assignment-analytics">
        <div className="analytics-cards">
          <div className="analytics-card">
            <h4>Superscore average</h4>
            <div className="metric-value">87%</div>
            <div className="metric-change positive">↑ 5% from last assignment</div>
          </div>
          <div className="analytics-card">
            <h4>Misuse Flags to Review</h4>
            <div className="metric-value">2</div>
            <div className="metric-change negative">↑ 1 from last assignment</div>
          </div>
          <div className="analytics-card">
            <h4>Time Distribution</h4>
            <div className="chart-container">
              <div className="pie-chart">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="transparent" stroke="#8b5cf6" strokeWidth="10" 
                    strokeDasharray="99 220" strokeDashoffset="0" transform="rotate(-90 40 40)" />
                  <circle cx="40" cy="40" r="35" fill="transparent" stroke="#06b6d4" strokeWidth="10" 
                    strokeDasharray="88 220" strokeDashoffset="-99" transform="rotate(-90 40 40)" />
                  <circle cx="40" cy="40" r="35" fill="transparent" stroke="#e5e7eb" strokeWidth="10" 
                    strokeDasharray="33 220" strokeDashoffset="-187" transform="rotate(-90 40 40)" />
                </svg>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#8b5cf6'}}></span>
                  <span>AI Assisted (45%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#06b6d4'}}></span>
                  <span>Active Work (40%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#e5e7eb'}}></span>
                  <span>Idle (15%)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="analytics-card">
            <h4>Assignment median</h4>
            <div className="metric-value">84%</div>
            <div className="metric-change positive">↑ 3% from last assignment</div>
          </div>
        </div>
      </div>

      <div className="assignment-page-tabs">
        <div className="assignment-page-tabs-inner">
          <button 
            className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
          </button>
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="assignment-page-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="content-section">
              <h3>Instructions</h3>
              <p className="instructions-text">{assignment.instructions}</p>
            </div>
            
            <div className="content-section">
              <h3>Assignment Content</h3>
              <div className="assignment-content-display">
                {assignment.content.map((item, index) => (
                  <div key={index} className={`content-item ${item.type}`}>
                    {item.type === 'text' && <p>{item.content}</p>}
                    {item.type === 'math' && (
                      <div className="math-content">
                        <code>{item.content}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="submissions-content">
            <div className="submissions-table-container">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Submitted</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Alice Brown</td>
                    <td>2024-01-14 3:45 PM</td>
                    <td>95%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Alice Brown', 1)}>View</button></td>
                  </tr>
                  <tr>
                    <td>John Davis</td>
                    <td>2024-01-15 11:22 AM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Sarah Miller</td>
                    <td>2024-01-14 8:15 PM</td>
                    <td>92%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Sarah Miller', 2)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Michael Chen</td>
                    <td>2024-01-15 2:10 PM</td>
                    <td>88%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Michael Chen', 3)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Emma Johnson</td>
                    <td>2024-01-14 1:30 PM</td>
                    <td>97%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Emma Johnson', 4)}>View</button></td>
                  </tr>
                  <tr>
                    <td>David Wilson</td>
                    <td>2024-01-15 9:45 AM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Lisa Garcia</td>
                    <td>2024-01-14 7:20 PM</td>
                    <td>91%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Lisa Garcia', 5)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Ryan Thompson</td>
                    <td>2024-01-14 4:55 PM</td>
                    <td>85%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Ryan Thompson', 6)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Jessica Wang</td>
                    <td>2024-01-15 6:30 PM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Alex Rodriguez</td>
                    <td>2024-01-14 10:15 AM</td>
                    <td>89%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Alex Rodriguez', 7)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Sophia Lee</td>
                    <td>2024-01-14 6:45 PM</td>
                    <td>94%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Sophia Lee', 8)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Marcus Smith</td>
                    <td>2024-01-15 1:20 PM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Olivia Martinez</td>
                    <td>2024-01-14 5:10 PM</td>
                    <td>93%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Olivia Martinez', 9)}>View</button></td>
                  </tr>
                  <tr>
                    <td>James Anderson</td>
                    <td>2024-01-14 2:35 PM</td>
                    <td>87%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('James Anderson', 10)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Ava Taylor</td>
                    <td>2024-01-15 4:15 PM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Noah Jackson</td>
                    <td>2024-01-14 9:25 AM</td>
                    <td>90%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Noah Jackson', 11)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Mia Williams</td>
                    <td>2024-01-14 11:50 AM</td>
                    <td>96%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Mia Williams', 12)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Ethan Clark</td>
                    <td>2024-01-15 12:40 PM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Grace Lewis</td>
                    <td>2024-01-14 3:20 PM</td>
                    <td>84%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Grace Lewis', 13)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Lucas Hall</td>
                    <td>2024-01-15 8:30 AM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                  <tr>
                    <td>Isabella Young</td>
                    <td>2024-01-14 7:55 PM</td>
                    <td>91%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('Isabella Young', 14)}>View</button></td>
                  </tr>
                  <tr>
                    <td>William King</td>
                    <td>2024-01-14 12:15 PM</td>
                    <td>86%</td>
                    <td><span className="status-badge graded">Graded</span></td>
                    <td><button className="action-btn secondary" onClick={() => handleViewSubmission('William King', 15)}>View</button></td>
                  </tr>
                  <tr>
                    <td>Charlotte Wright</td>
                    <td>2024-01-15 3:50 PM</td>
                    <td>-</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td><button className="action-btn primary">Grade</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Completion Rate</h4>
                <div className="analytics-value">82%</div>
                <div className="analytics-trend positive">↑ 5% from last assignment</div>
              </div>
              <div className="analytics-card">
                <h4>Average Time Spent</h4>
                <div className="analytics-value">24 min</div>
                <div className="analytics-trend neutral">→ Same as average</div>
              </div>
              <div className="analytics-card">
                <h4>Help Requests</h4>
                <div className="analytics-value">12</div>
                <div className="analytics-trend negative">↑ 3 from last assignment</div>
              </div>
              <div className="analytics-card">
                <h4>First Attempt Success</h4>
                <div className="analytics-value">68%</div>
                <div className="analytics-trend positive">↑ 8% from last assignment</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;