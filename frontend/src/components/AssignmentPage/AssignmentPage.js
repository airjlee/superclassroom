import React, { useState } from 'react';
import './AssignmentPage.css';

const AssignmentPage = ({ assignmentId, courseId, onNavigateBack }) => {
  // Mock assignment data - in real app this would come from API based on assignmentId
  const assignmentData = {
    1: {
      title: 'Limits and Continuity',
      type: 'SuperQuiz',
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
      type: 'SuperConcept',
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
      type: 'SuperQuiz',
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
      type: 'SuperConcept',
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
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="assignment-page">
      <div className="assignment-page-header">
        <div className="assignment-header-info">
          <div className="assignment-title-section">
            <div className="title-and-badge">
              <h1 className="assignment-title">{assignment.title}</h1>
              <span className={`assignment-type-badge ${assignment.type.toLowerCase()}`}>
                {assignment.type}
              </span>
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
          <div className="meta-item">
            <span className="meta-label">Start Date:</span>
            <span className="meta-value">{assignment.startDate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Due Date:</span>
            <span className="meta-value">{assignment.dueDate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Submissions:</span>
            <span className={`meta-value submissions-${getSubmissionStatus()}`}>
              {assignment.submissionsCount} of {assignment.totalStudents}
            </span>
          </div>
        </div>
      </div>

      <div className="assignment-page-tabs">
        <div className="assignment-page-tabs-inner">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
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
            <div className="submissions-summary">
              <div className="summary-card">
                <h4>Total Submissions</h4>
                <div className="summary-value">{assignment.submissionsCount}</div>
              </div>
              <div className="summary-card">
                <h4>Pending Reviews</h4>
                <div className="summary-value">{Math.max(0, assignment.submissionsCount - 15)}</div>
              </div>
              <div className="summary-card">
                <h4>Average Score</h4>
                <div className="summary-value">87%</div>
              </div>
            </div>
            
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
                    <td><button className="action-btn secondary">View</button></td>
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
                    <td><button className="action-btn secondary">View</button></td>
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