import React, { useState } from 'react';
import './CourseDashboard.css';

const CourseDashboard = ({ courseId, onNavigateBack, onNavigateToCreate }) => {
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  // Mock course data - in real app this would come from API
  const courseData = {
    1: { name: 'Calculus I', subject: 'Mathematics', students: 28, color: '#4A90E2' },
    2: { name: 'Biology 101', subject: 'Science', students: 35, color: '#7ED321' },
    3: { name: 'World History', subject: 'Social Studies', students: 32, color: '#F5A623' },
    4: { name: 'English Literature', subject: 'Language Arts', students: 25, color: '#9013FE' }
  };

  const course = courseData[courseId];

  // Mock assignments data
  const assignments = [
    { id: 1, title: 'Limits and Continuity', type: 'SuperQuiz', dueDate: '2024-01-15', submissions: 23 },
    { id: 2, title: 'Derivative Rules', type: 'SuperConcept', dueDate: '2024-01-18', submissions: 25 },
    { id: 3, title: 'Chain Rule Practice', type: 'SuperQuiz', dueDate: '2024-01-22', submissions: 20 },
  ];

  const handleCreateSelection = (type) => {
    setShowCreateDropdown(false);
    onNavigateToCreate(type);
  };

  const handleBackToDashboard = () => {
    onNavigateBack();
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-dashboard">
      <div className="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Teaching</div>
            <button className="nav-item" onClick={handleBackToDashboard}>
              <span className="nav-icon">🏠</span>
              Dashboard
            </button>
            <button className="nav-item active">
              <span className="nav-icon">📚</span>
              {course.name}
            </button>
            <button className="nav-item">
              <span className="nav-icon">📝</span>
              Assignments
            </button>
            <button className="nav-item">
              <span className="nav-icon">📊</span>
              Gradebook
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Course Tools</div>
            <button className="nav-item">
              <span className="nav-icon">👥</span>
              People
            </button>
            <button className="nav-item">
              <span className="nav-icon">📈</span>
              Analytics
            </button>
            <button className="nav-item">
              <span className="nav-icon">💬</span>
              Discussions
            </button>
            <button className="nav-item">
              <span className="nav-icon">📎</span>
              Files
            </button>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Account</div>
            <button className="nav-item">
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
            <button className="nav-item">
              <span className="nav-icon">❓</span>
              Help
            </button>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <div className="course-header">
          <div className="course-info">
            <h1>{course.name}</h1>
            <div className="course-meta">
              <span className="course-subject">{course.subject}</span>
              <span className="student-count">{course.students} students</span>
            </div>
          </div>

          <div className="create-section">
            <div className="create-dropdown-container">
              <button 
                className="create-btn"
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              >
                <span className="create-icon">+</span>
                Create
                <span className="dropdown-arrow">▾</span>
              </button>
              
              {showCreateDropdown && (
                <div className="create-dropdown">
                  <button 
                    className="dropdown-item"
                    onClick={() => handleCreateSelection('SuperConcept')}
                  >
                    <span className="item-icon">📚</span>
                    <div className="item-content">
                      <span className="item-title">SuperConcept</span>
                      <span className="item-description">Interactive lesson with AI guidance</span>
                    </div>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleCreateSelection('SuperQuiz')}
                  >
                    <span className="item-icon">📝</span>
                    <div className="item-content">
                      <span className="item-title">SuperQuiz</span>
                      <span className="item-description">Assessment with intelligent feedback</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="assignments-section">
            <h2>Recent Assignments</h2>
            <div className="assignments-grid">
              {assignments.map(assignment => (
                <div key={assignment.id} className="assignment-card">
                  <div className="assignment-header">
                    <h3>{assignment.title}</h3>
                    <span className={`assignment-type ${assignment.type.toLowerCase()}`}>
                      {assignment.type}
                    </span>
                  </div>
                  <div className="assignment-stats">
                    <div className="stat">
                      <span className="stat-label">Due Date</span>
                      <span className="stat-value">{assignment.dueDate}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Submissions</span>
                      <span className="stat-value">{assignment.submissions}/{course.students}</span>
                    </div>
                  </div>
                  <div className="assignment-actions">
                    <button className="action-btn secondary">View Results</button>
                    <button className="action-btn primary">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h2>Course Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Average Score</h3>
                <div className="stat-number">85%</div>
              </div>
              <div className="stat-card">
                <h3>Completion Rate</h3>
                <div className="stat-number">92%</div>
              </div>
              <div className="stat-card">
                <h3>Active Students</h3>
                <div className="stat-number">26/28</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard; 