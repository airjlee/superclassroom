import React, { useState } from 'react';
import './TeacherDashboard.css';

// Utility functions to lighten or darken a hex color
const adjustColor = (hex, amt) => {
  let usePound = false;
  let color = hex;
  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);
  let r = (num >> 16) + amt;
  let g = (num >> 8 & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  const newColor = (r << 16) | (g << 8) | b;
  return (usePound ? '#' : '') + newColor.toString(16).padStart(6, '0');
};

const lightenColor = (hex, percent = 20) => adjustColor(hex, Math.round(2.55 * percent));
const darkenColor = (hex, percent = 20) => adjustColor(hex, -Math.round(2.55 * percent));

const TeacherDashboard = ({ onNavigateToCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(32); // 2rem = 32px
  
  // Mock courses data - in real app this would come from API
  const courses = [
    {
      id: 1,
      name: 'Calculus I',
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    // Constrain the button position to stay within reasonable bounds
    const minY = 24; // 1.5rem
    const maxY = rect.height - 24; // 1.5rem from bottom
    const constrainedY = Math.max(minY, Math.min(maxY, relativeY));
    setButtonPosition(constrainedY);
  };

  return (
    <div className="teacher-dashboard">
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
            <button className="nav-item" title="Course Members">
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
                placeholder="Ask anything or @mention a specific course..."
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
              style={{ '--course-color': course.color, '--course-color-light': lightenColor(course.color, 30), '--course-color-dark': darkenColor(course.color, 20) }}
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