import React, { useState } from 'react';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onNavigateToCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
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
      <div className="sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Teaching</div>
            <button className="nav-item active">
              <span className="nav-icon">🏠</span>
              Dashboard
            </button>
            <button className="nav-item">
              <span className="nav-icon">📚</span>
              All Courses
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
            <div className="nav-section-title">Management</div>
            <button className="nav-item">
              <span className="nav-icon">👥</span>
              Students
            </button>
            <button className="nav-item">
              <span className="nav-icon">📈</span>
              Analytics
            </button>
            <button className="nav-item">
              <span className="nav-icon">💬</span>
              Messages
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