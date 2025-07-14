import React, { useState } from 'react';
import './CourseDashboard.css';

const CourseDashboard = ({ courseId, onNavigateBack, onNavigateToCreate }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [assignmentFilter, setAssignmentFilter] = useState('all');

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
    { id: 1, title: 'Limits and Continuity', type: 'SuperQuiz', dueDate: '2024-01-15', submissions: 23, status: 'completed' },
    { id: 2, title: 'Derivative Rules', type: 'SuperConcept', dueDate: '2024-01-18', submissions: 25, status: 'pending' },
    { id: 3, title: 'Chain Rule Practice', type: 'SuperQuiz', dueDate: '2024-01-22', submissions: 20, status: 'pending' },
    { id: 4, title: 'Integration Basics', type: 'SuperConcept', dueDate: '2024-01-25', submissions: 0, status: 'draft' },
  ];

  // Filter assignments based on selected filter
  const filteredAssignments = assignments.filter(assignment => {
    if (assignmentFilter === 'all') return true;
    if (assignmentFilter === 'pending') return assignment.status === 'pending';
    if (assignmentFilter === 'completed') return assignment.status === 'completed';
    if (assignmentFilter === 'drafts') return assignment.status === 'draft';
    return true;
  });



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
            <h1><span className="gradient-course-name">Dr. Averbeck's</span> {course.name}</h1>
            <div className="course-meta">
              <span className="course-subject">{course.subject}</span>
              <span className="student-count">{course.students} students</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => setActiveTab('feed')}
              >
                Feed
              </button>
              <button 
                className={`tab-button ${activeTab === 'assignments' ? 'active' : ''}`}
                onClick={() => setActiveTab('assignments')}
              >
                Assignments
              </button>
              <button 
                className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                Students
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'feed' && (
                <div className="feed-content">
                  <div className="feed-item">
                    <div className="feed-header">
                      <h3>New Assignment Posted</h3>
                      <span className="feed-time">2 hours ago</span>
                    </div>
                    <p>Limits and Continuity assignment has been posted. Due date: January 15th</p>
                  </div>
                  
                  <div className="feed-item">
                    <div className="feed-header">
                      <h3>Class Announcement</h3>
                      <span className="feed-time">1 day ago</span>
                    </div>
                    <p>Office hours this week will be moved to Thursday 2-4 PM instead of Wednesday.</p>
                  </div>
                  
                  <div className="feed-item">
                    <div className="feed-header">
                      <h3>Assignment Graded</h3>
                      <span className="feed-time">3 days ago</span>
                    </div>
                    <p>Derivative Rules assignment has been graded. Average score: 87%</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'assignments' && (
                <div className="assignments-content">
                  <div className="assignments-section">
                    <div className="assignment-filters">
                      <button 
                        className={`filter-button ${assignmentFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setAssignmentFilter('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`filter-button ${assignmentFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setAssignmentFilter('pending')}
                      >
                        Pending to Grade
                      </button>
                      <button 
                        className={`filter-button ${assignmentFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setAssignmentFilter('completed')}
                      >
                        Completed
                      </button>
                      <button 
                        className={`filter-button ${assignmentFilter === 'drafts' ? 'active' : ''}`}
                        onClick={() => setAssignmentFilter('drafts')}
                      >
                        Drafts
                      </button>
                    </div>
                    <div className="assignments-grid">
                      {filteredAssignments.map(assignment => (
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
                </div>
              )}
              
              {activeTab === 'students' && (
                <div className="students-content">
                  <div className="students-grid">
                    <div className="student-card">
                      <div className="student-avatar">AB</div>
                      <div className="student-info">
                        <h3>Alice Brown</h3>
                        <p>alice.brown@university.edu</p>
                        <span className="student-score">Average: 92%</span>
                      </div>
                    </div>
                    
                    <div className="student-card">
                      <div className="student-avatar">JD</div>
                      <div className="student-info">
                        <h3>John Davis</h3>
                        <p>john.davis@university.edu</p>
                        <span className="student-score">Average: 87%</span>
                      </div>
                    </div>
                    
                    <div className="student-card">
                      <div className="student-avatar">SM</div>
                      <div className="student-info">
                        <h3>Sarah Miller</h3>
                        <p>sarah.miller@university.edu</p>
                        <span className="student-score">Average: 95%</span>
                      </div>
                    </div>
                    
                    <div className="student-card">
                      <div className="student-avatar">MW</div>
                      <div className="student-info">
                        <h3>Mike Wilson</h3>
                        <p>mike.wilson@university.edu</p>
                        <span className="student-score">Average: 84%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboard; 