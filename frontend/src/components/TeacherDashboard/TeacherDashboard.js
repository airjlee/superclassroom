import React, { useState } from 'react';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onNavigateToCourse }) => {
  
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
      name: 'Biology 101',
      subject: 'Science',
      students: 35,
      color: '#7ED321'
    },
    {
      id: 3,
      name: 'World History',
      subject: 'Social Studies',
      students: 32,
      color: '#F5A623'
    },
    {
      id: 4,
      name: 'English Literature',
      subject: 'Language Arts',
      students: 25,
      color: '#9013FE'
    }
  ];

  const handleCourseClick = (courseId) => {
    onNavigateToCourse(courseId);
  };

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, Professor!</h1>
        <p>Select a course to get started</p>
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
      
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>View Analytics</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">👥</span>
            <span>Manage Students</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 