import React, { useState } from 'react';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onNavigateToCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Mock courses data - in real app this would come from API
  const courses = [
    {
      id: 1,
      name: 'Linear Algebra',
      subject: 'Mathematics',
      students: 28,
      color: '#4A90E2'
    },
    {
      id: 2,
      name: 'Calculus II',
      subject: 'Mathematics',
      students: 35,
      color: '#7ED321'
    },
    {
      id: 3,
      name: 'Calculus III',
      subject: 'Mathematics',
      students: 32,
      color: '#F5A623'
    },
    {
      id: 4,
      name: 'Differential Equations',
      subject: 'Mathematics',
      students: 25,
      color: '#9013FE'
    }
  ];

  const handleCourseClick = (courseId) => {
    onNavigateToCourse(courseId);
  };

  return (
    <div className="teacher-dashboard">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div 
          className="sidebar-border-hover"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <button className="collapse-btn">
            <span className="material-icons">
              {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <div className="nav-section-title">Teaching</div>}
            <button className="nav-item active" title="Dashboard">
              <span className="nav-icon material-icons">dashboard</span>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>
            <button className="nav-item" title="All Courses">
              <span className="nav-icon material-icons">school</span>
              {!sidebarCollapsed && <span>All Courses</span>}
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
            {!sidebarCollapsed && <div className="nav-section-title">Management</div>}
            <button className="nav-item" title="Students">
              <span className="nav-icon material-icons">group</span>
              {!sidebarCollapsed && <span>Students</span>}
            </button>
            <button className="nav-item" title="Analytics">
              <span className="nav-icon material-icons">analytics</span>
              {!sidebarCollapsed && <span>Analytics</span>}
            </button>
            <button className="nav-item" title="Messages">
              <span className="nav-icon material-icons">message</span>
              {!sidebarCollapsed && <span>Messages</span>}
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
        <div className="content-header">
          <h1>Hello, <span className="gradient-name">Dr. Averbeck</span></h1>
          {/* <p>Welcome back! Here's an overview of your courses.</p> */}
          
          <div className="search-container">
            <div className="search-bar">
              <span className="search-icon">⌘</span>
              <input
                type="text"
                placeholder="Search courses, assignments, or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
        
        <div className="courses-grid">
          {courses.map(course => (
            <div 
              key={course.id}
              className="course-card"
              onClick={() => handleCourseClick(course.id)}
              style={{ '--course-color': course.color }}
            >
              <div className="course-header">
                <h3>{course.name}</h3>
                <span className="course-subject">{course.subject}</span>
              </div>
              <div className="course-stats">
                <span className="student-count">{course.students} students</span>
              </div>
              <div className="course-actions">
                <span className="view-course">View Course →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 