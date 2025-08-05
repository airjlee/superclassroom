import React, { useState, useRef } from 'react';
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

const TeacherDashboard = ({ onNavigateToCourse, onNavigateToCreate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(32); // 2rem = 32px
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionType, setMentionType] = useState(''); // 'course' or 'assignment'
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);
  
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

  const assignmentTypes = [
    {
      id: 'superconcept',
      name: 'Superconcept',
      color: '#7b1fa2'
    },
    {
      id: 'superquiz',
      name: 'Superquiz',
      color: '#1565c0'
    }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCursorPosition(e.target.selectionStart);
    
    // Check if @ was typed for courses
    const atIndex = value.lastIndexOf('@');
    const hashIndex = value.lastIndexOf('#');
    
    if (atIndex !== -1 && (hashIndex === -1 || atIndex > hashIndex)) {
      const queryAfterAt = value.substring(atIndex + 1);
      setMentionQuery(queryAfterAt);
      setShowMentions(true);
      setSelectedMentionIndex(0);
      setMentionType('course');
    } else if (hashIndex !== -1 && (atIndex === -1 || hashIndex > atIndex)) {
      const queryAfterHash = value.substring(hashIndex + 1);
      setMentionQuery(queryAfterHash);
      setShowMentions(true);
      setSelectedMentionIndex(0);
      setMentionType('assignment');
    } else {
      setShowMentions(false);
      setMentionQuery('');
      setSelectedMentionIndex(0);
      setMentionType('');
    }
  };

  const handleKeyDown = (e) => {
    if (showMentions) {
      const options = mentionType === 'course' ? filteredCourses : filteredAssignmentTypes;
      if (options.length > 0) {
        if (e.key === 'Tab') {
          e.preventDefault();
          handleMentionSelect(options[selectedMentionIndex].name, mentionType);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedMentionIndex((prev) => 
            prev < options.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedMentionIndex((prev) => 
            prev > 0 ? prev - 1 : options.length - 1
          );
        } else if (e.key === 'Enter' && selectedMentionIndex >= 0) {
          e.preventDefault();
          handleMentionSelect(options[selectedMentionIndex].name, mentionType);
        }
      }
    } else if (e.key === 'Enter' && searchQuery.trim() && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMentionSelect = (name, type) => {
    const symbol = type === 'course' ? '@' : '#';
    const symbolIndex = searchQuery.lastIndexOf(symbol);
    const beforeSymbol = searchQuery.substring(0, symbolIndex);
    const newQuery = beforeSymbol + name + ' ';
    setSearchQuery(newQuery);
    setShowMentions(false);
    setMentionQuery('');
    setSelectedMentionIndex(0);
    setMentionType('');
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const filteredAssignmentTypes = assignmentTypes.filter(type =>
    type.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handlePlusClick = () => {
    setShowPlusDropdown(!showPlusDropdown);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    // Here you would typically upload the file to your server
    console.log('Files selected:', files.map(f => f.name));
    setShowPlusDropdown(false);
    // Focus the search input after file upload
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.plus-button-container')) {
      setShowPlusDropdown(false);
    }
  };

  // Add event listener for clicking outside
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle fade-in animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate API call for 3 seconds total
      setTimeout(() => {
        setIsLoading(false);
        setSearchQuery('');
        setIsFading(true);
        // Navigate to assignment creation page after fade
        setTimeout(() => {
          // Navigate to assignment creation page
          onNavigateToCreate();
        }, 500); // Wait for fade animation to complete
      }, 3000);
    }
  };

  const renderSearchContent = () => {
    const parts = searchQuery.split(/(@\w+|#\w+)/);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const courseName = part.substring(1);
        const course = courses.find(c => c.name.toLowerCase().includes(courseName.toLowerCase()));
        if (course) {
          return (
            <span 
              key={index}
              className="course-badge"
              style={{ 
                backgroundColor: course.color === '#4A90E2' ? 'rgba(74, 144, 226, 0.1)' :
                             course.color === '#7ED321' ? 'rgba(126, 211, 33, 0.1)' :
                             course.color === '#F5A623' ? 'rgba(245, 166, 35, 0.1)' :
                             'rgba(144, 19, 254, 0.1)',
                color: course.color
              }}
            >
              {course.name}
            </span>
          );
        }
      } else if (part.startsWith('#')) {
        const typeName = part.substring(1);
        const type = assignmentTypes.find(t => t.name.toLowerCase().includes(typeName.toLowerCase()));
        if (type) {
          return (
            <span 
              key={index}
              className="course-badge"
              style={{ 
                backgroundColor: type.color === '#7b1fa2' ? 'rgba(123, 31, 162, 0.1)' : 'rgba(21, 101, 192, 0.1)',
                color: type.color
              }}
            >
              {type.name}
            </span>
          );
        }
      }
      return part;
    });
  };

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
    <div className={`teacher-dashboard ${isFading ? 'fade-out' : isFadingIn ? '' : 'fade-in'}`}>
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
            <div className={`search-bar ${selectedFiles.length > 0 ? 'has-files' : ''}`}>
              <div className="plus-button-container">
                <button 
                  className="plus-button"
                  onClick={handlePlusClick}
                  type="button"
                >
                  <span className="plus-icon">+</span>
                </button>
                {showPlusDropdown && (
                  <div className="plus-dropdown">
                    <button 
                      className="dropdown-item"
                      onClick={handleFileUpload}
                    >
                      <span className="material-icons">upload_file</span>
                      File Upload
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="*/*"
                  multiple
                />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ask anything or @mention a specific course..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="search-input"
              />
              <button 
                className={`send-button ${isLoading ? 'loading' : ''}`}
                onClick={handleSend}
                disabled={!searchQuery.trim() || isLoading}
                type="button"
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <span className="material-icons">send</span>
                )}
              </button>
              {showMentions && (
                <div 
                  className="mentions-dropdown"
                  style={{
                    position: 'absolute',
                    left: `${Math.min(cursorPosition * 8, 200)}px`,
                    top: '100%',
                    marginTop: '0.25rem'
                  }}
                >
                  {mentionType === 'course' ? (
                    filteredCourses.map((course, index) => (
                      <button
                        key={course.id}
                        className={`mention-option ${index === selectedMentionIndex ? 'selected' : ''}`}
                        onClick={() => handleMentionSelect(course.name, 'course')}
                      >
                        <span 
                          className="course-badge"
                          style={{ 
                            backgroundColor: course.color === '#4A90E2' ? 'rgba(74, 144, 226, 0.1)' :
                                         course.color === '#7ED321' ? 'rgba(126, 211, 33, 0.1)' :
                                         course.color === '#F5A623' ? 'rgba(245, 166, 35, 0.1)' :
                                         'rgba(144, 19, 254, 0.1)',
                            color: course.color
                          }}
                        >
                          {course.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    filteredAssignmentTypes.map((type, index) => (
                      <button
                        key={type.id}
                        className={`mention-option ${index === selectedMentionIndex ? 'selected' : ''}`}
                        onClick={() => handleMentionSelect(type.name, 'assignment')}
                      >
                        <span 
                          className="course-badge"
                          style={{ 
                            backgroundColor: type.color === '#7b1fa2' ? 'rgba(123, 31, 162, 0.1)' : 'rgba(21, 101, 192, 0.1)',
                            color: type.color
                          }}
                        >
                          {type.name}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
              {selectedFiles.length > 0 && (
                <div className="file-badges-container">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-badge">
                      <span className="file-badge-icon material-icons">description</span>
                      <span className="file-badge-name">{file.name}</span>
                      <button 
                        className="file-badge-remove"
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      >
                        <span className="material-icons">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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