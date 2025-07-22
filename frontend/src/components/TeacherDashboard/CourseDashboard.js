import React, { useState } from 'react';
import './CourseDashboard.css';

const CourseDashboard = ({ courseId, onNavigateBack, onNavigateToCreate }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [feedFilter, setFeedFilter] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(32); // 2rem = 32px

  // Mock course data - in real app this would come from API
  const courseData = {
    1: { name: 'Calculus I', subject: 'Mathematics', students: 28, color: '#4A90E2' },
    2: { name: 'Biology 101', subject: 'Science', students: 35, color: '#7ED321' },
    3: { name: 'World History', subject: 'Social Studies', students: 32, color: '#F5A623' },
    4: { name: 'English Literature', subject: 'Language Arts', students: 25, color: '#9013FE' }
  };

  const course = courseData[courseId];

  // Helper function to get icon for feed item type
  const getFeedIcon = (type) => {
    switch (type) {
      case 'announcement':
        return 'campaign'; // speaker/megaphone icon
      case 'assignment':
        return 'assignment'; // assignment icon
      case 'question':
        return 'quiz'; // question icon
      default:
        return 'info';
    }
  };

  // Helper function to get submission status color
  const getSubmissionStatus = (submissions, total) => {
    const percentage = submissions / total;
    if (submissions === total) return 'complete';
    if (percentage >= 0.5) return 'partial';
    return 'low';
  };

  // Mock assignments data
  const assignments = [
    { id: 1, title: 'Limits and Continuity', type: 'SuperQuiz', startDate: '2024-01-10', dueDate: '2024-01-15', submissions: 23, totalStudents: 28, status: 'completed' },
    { id: 2, title: 'Derivative Rules', type: 'SuperConcept', startDate: '2024-01-12', dueDate: '2024-01-18', submissions: 25, totalStudents: 28, status: 'pending' },
    { id: 3, title: 'Chain Rule Practice', type: 'SuperQuiz', startDate: '2024-01-15', dueDate: '2024-01-22', submissions: 20, totalStudents: 28, status: 'pending' },
    { id: 4, title: 'Integration Basics', type: 'SuperConcept', startDate: '2024-01-20', dueDate: '2024-01-25', submissions: 0, totalStudents: 28, status: 'draft' },
  ];

  // Mock feed data
  const feedItems = [
    { id: 1, type: 'announcement', title: 'Welcome to Calculus I', content: 'Looking forward to a great semester! Please review the syllabus.', time: '5 days ago', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, source: 'instructor', replies: 15 },
    { id: 2, type: 'assignment', title: 'New Assignment Posted', content: 'Limits and Continuity quiz has been assigned.', time: '2 hours ago', timestamp: Date.now() - 2 * 60 * 60 * 1000, source: 'instructor', replies: 3 },
    { id: 3, type: 'assignment', title: 'Assignment Graded', content: 'Derivative Rules assignment has been graded. Average score: 87%', time: '1 day ago', timestamp: Date.now() - 24 * 60 * 60 * 1000, source: 'instructor', replies: 8 },
    { id: 4, type: 'question', title: 'Question about Homework', content: 'Can someone explain problem #5 from the derivative worksheet?', time: '3 hours ago', timestamp: Date.now() - 3 * 60 * 60 * 1000, source: 'student', author: 'Alice Brown', replies: 12 },
    { id: 5, type: 'question', title: 'Study Group Formation', content: 'Anyone interested in forming a study group for the midterm?', time: '6 hours ago', timestamp: Date.now() - 6 * 60 * 60 * 1000, source: 'student', author: 'John Doe', replies: 7 },
  ];

  // Filter assignments based on selected filter
  const filteredAssignments = assignments.filter(assignment => {
    if (assignmentFilter === 'all') return true;
    if (assignmentFilter === 'pending') return assignment.status === 'pending';
    if (assignmentFilter === 'completed') return assignment.status === 'completed';
    if (assignmentFilter === 'drafts') return assignment.status === 'draft';
    return true;
  });

  // Filter feed items based on selected filter
  const filteredFeedItems = feedItems.filter(item => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'instructors') return item.source === 'instructor';
    if (feedFilter === 'students') return item.source === 'student';
    return true;
  }).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first


  const handleBackToDashboard = () => {
    onNavigateBack();
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    // Constrain the button position to stay within reasonable bounds
    const minY = 24; // 1.5rem
    const maxY = rect.height - 24; // 1.5rem from bottom
    const constrainedY = Math.max(minY, Math.min(maxY, relativeY));
    setButtonPosition(constrainedY);
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-dashboard">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div 
          className="sidebar-border-hover"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMouseMove={handleMouseMove}
        >
          <button 
            className="collapse-btn"
            style={{ top: `${buttonPosition}px` }}
          >
            <span className="material-icons">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <div className="nav-section-title">Teaching</div>}
            <button className="nav-item" onClick={handleBackToDashboard} title="Dashboard">
              <span className="nav-icon material-icons">dashboard</span>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>
            <button className="nav-item active" title={course.name}>
              <span className="nav-icon material-icons">school</span>
              {!sidebarCollapsed && <span>{course.name}</span>}
            </button>
            <button className="nav-item" title="Assignments">
              <span className="nav-icon material-icons">assignment</span>
              {!sidebarCollapsed && <span>Assignments</span>}
            </button>
            <button className="nav-item" title="Gradebook">
              <span className="nav-icon material-icons">grade</span>
              {!sidebarCollapsed && <span>Gradebook</span>}
            </button>
          </div>
          
          <div className="nav-section">
            {!sidebarCollapsed && <div className="nav-section-title">Course Tools</div>}
            <button className="nav-item" title="People">
              <span className="nav-icon material-icons">group</span>
              {!sidebarCollapsed && <span>People</span>}
            </button>
            <button className="nav-item" title="Analytics">
              <span className="nav-icon material-icons">analytics</span>
              {!sidebarCollapsed && <span>Analytics</span>}
            </button>
            <button className="nav-item" title="Discussions">
              <span className="nav-icon material-icons">forum</span>
              {!sidebarCollapsed && <span>Discussions</span>}
            </button>
            <button className="nav-item" title="Files">
              <span className="nav-icon material-icons">folder</span>
              {!sidebarCollapsed && <span>Files</span>}
            </button>
          </div>
          
          <div className="nav-section">
            {!sidebarCollapsed && <div className="nav-section-title">Account</div>}
            <button className="nav-item" title="Settings">
              <span className="nav-icon material-icons">settings</span>
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
            <button className="nav-item" title="Help">
              <span className="nav-icon material-icons">help</span>
              {!sidebarCollapsed && <span>Help</span>}
            </button>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <div className="course-dashboard-header">
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
                  <div className="assignments-section">
                    <div className="assignment-filters">
                      <button 
                        className={`filter-button ${feedFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setFeedFilter('all')}
                      >
                        All
                      </button>
                      <button 
                        className={`filter-button ${feedFilter === 'instructors' ? 'active' : ''}`}
                        onClick={() => setFeedFilter('instructors')}
                      >
                        Instructors
                      </button>
                      <button 
                        className={`filter-button ${feedFilter === 'students' ? 'active' : ''}`}
                        onClick={() => setFeedFilter('students')}
                      >
                        Students
                      </button>
                    </div>
                    <div className="feed-items">
                      {filteredFeedItems.map(item => (
                        <div key={item.id} className="feed-item">
                          <div className="feed-header">
                            <div className="feed-title-container">
                              <span className="material-icons feed-icon">{getFeedIcon(item.type)}</span>
                              <h3>{item.title}</h3>
                            </div>
                            <div className="feed-meta">
                              {item.author && <span className="feed-author">{item.author}</span>}
                              <span className="feed-time">{item.time}</span>
                            </div>
                          </div>
                          <p>{item.content}</p>
                          <div className="feed-footer">
                            <span className="feed-replies">{item.replies} {item.replies === 1 ? 'reply' : 'replies'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    <div className="assignments-table-container">
                      <table className="assignments-table">
                        <thead>
                          <tr>
                            <th>Assignment</th>
                            <th>Start date</th>
                            <th>Due date</th>
                            <th>Turned in</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAssignments.map(assignment => (
                            <tr key={assignment.id}>
                              <td>
                                <div className="assignment-info">
                                  <h4>{assignment.title}</h4>
                                  <span className={`assignment-type ${assignment.type.toLowerCase()}`}>
                                    {assignment.type}
                                  </span>
                                </div>
                              </td>
                              <td>{assignment.startDate}</td>
                              <td>{assignment.dueDate}</td>
                              <td>
                                <span className={`submissions-count ${getSubmissionStatus(assignment.submissions, assignment.totalStudents)}`}>
                                  {assignment.submissions} of {assignment.totalStudents}
                                </span>
                              </td>
                              <td>
                                <button className="action-btn primary table-edit-btn">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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