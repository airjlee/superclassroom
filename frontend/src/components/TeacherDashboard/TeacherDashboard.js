import React, { useState, useRef, useEffect } from 'react';
import './TeacherDashboard.css';

// Helper function to adjust color brightness
const adjustColor = (hex, amt) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) + amt;
  const g = (num >> 8 & 0x00FF) + amt;
  const b = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (r < 255 ? r < 1 ? 0 : r : 255) * 0x10000 +
    (g < 255 ? g < 1 ? 0 : g : 255) * 0x100 +
    (b < 255 ? b < 1 ? 0 : b : 255)).toString(16).slice(1);
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

  // Helper function to get background color for tags
  const getBackgroundColor = (color) => {
    const colorMap = {
      '#4A90E2': 'rgba(74, 144, 226, 0.1)',
      '#7ED321': 'rgba(126, 211, 33, 0.1)',
      '#F5A623': 'rgba(245, 166, 35, 0.1)',
      '#9013FE': 'rgba(144, 19, 254, 0.1)',
      '#7b1fa2': 'rgba(123, 31, 162, 0.1)',
      '#1565c0': 'rgba(21, 101, 192, 0.1)'
    };
    return colorMap[color] || 'rgba(74, 144, 226, 0.1)';
  };

  // Helper function to create formatted tag HTML
  const createFormattedTag = (name, type) => {
    if (type === 'course') {
      const course = courses.find(c => c.name === name);
      const color = course?.color || '#4A90E2';
      const bgColor = getBackgroundColor(color);
      
      return `<span class="course-badge" style="background-color: ${bgColor}; color: ${color}; display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.875rem; border-radius: 8px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; margin: 0 0.25rem; user-select: none; cursor: default;">${name}</span>`;
    } else {
      const assignmentType = assignmentTypes.find(t => t.name === name);
      const color = assignmentType?.color || '#7b1fa2';
      const bgColor = getBackgroundColor(color);
      
      return `<span class="course-badge" style="background-color: ${bgColor}; color: ${color}; display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.875rem; border-radius: 8px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; margin: 0 0.25rem; user-select: none; cursor: default;">${name}</span>`;
    }
  };

  // Helper function to set cursor position
  const setCaretPosition = (element, position) => {
    const range = document.createRange();
    const selection = window.getSelection();
    
    // Find the text node at the position
    let currentPos = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.length;
      if (currentPos + nodeLength >= position) {
        range.setStart(node, position - currentPos);
        range.setEnd(node, position - currentPos);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      currentPos += nodeLength;
    }
    
    // If we get here, set to end of element
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Helper function to get cursor position
  const getCursorPosition = (element, range) => {
    let position = 0;
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node === range.startContainer) {
        position += range.startOffset;
        break;
      }
      position += node.length;
    }
    
    return position;
  };

  const handleSearchChange = (e) => {
    const content = e.target.innerHTML;
    setSearchQuery(content);
    
    // Get cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const cursorPosition = getCursorPosition(e.target, range);
      setCursorPosition(cursorPosition);
    }
    
    // Check for @ or # triggers (only if not inside a tag)
    const textContent = e.target.textContent;
    const atIndex = textContent.lastIndexOf('@');
    const hashIndex = textContent.lastIndexOf('#');
    
    // Check if cursor is inside a tag
    let isInsideTag = false;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let parent = range.startContainer;
      while (parent && parent !== e.target) {
        if (parent.classList && parent.classList.contains('course-badge')) {
          isInsideTag = true;
          break;
        }
        parent = parent.parentElement;
      }
    }
    
    if (!isInsideTag) {
      if (atIndex !== -1 && (hashIndex === -1 || atIndex > hashIndex)) {
        const queryAfterAt = textContent.substring(atIndex + 1);
        setMentionQuery(queryAfterAt);
        setShowMentions(true);
        setSelectedMentionIndex(0);
        setMentionType('course');
      } else if (hashIndex !== -1 && (atIndex === -1 || hashIndex > atIndex)) {
        const queryAfterHash = textContent.substring(hashIndex + 1);
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
    
    // Enhanced backspace handling for tags
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        
        // Find the tag element to delete
        let tagElement = null;
        
        // Check if cursor is inside a tag
        if (startContainer.nodeType === Node.TEXT_NODE) {
          let parent = startContainer.parentElement;
          while (parent && parent !== searchInputRef.current) {
            if (parent.classList && parent.classList.contains('course-badge')) {
              tagElement = parent;
              break;
            }
            parent = parent.parentElement;
          }
        } else if (startContainer.nodeType === Node.ELEMENT_NODE) {
          if (startContainer.classList && startContainer.classList.contains('course-badge')) {
            tagElement = startContainer;
          }
        }
        
        // Check if cursor is right after a tag
        if (!tagElement && startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
          const previousNode = startContainer.previousSibling;
          if (previousNode && previousNode.classList && previousNode.classList.contains('course-badge')) {
            tagElement = previousNode;
          }
        }
        
        if (tagElement) {
          e.preventDefault();
          
          // Remove the tag element
          tagElement.remove();
          
          // Update the search query state
          setSearchQuery(searchInputRef.current.innerHTML);
          
          // Set cursor position after tag removal
          const newRange = document.createRange();
          newRange.setStartAfter(tagElement.nextSibling || searchInputRef.current);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }
  };

  const handleMentionSelect = (name, type) => {
    const symbol = type === 'course' ? '@' : '#';
    const textContent = searchInputRef.current.textContent;
    const symbolIndex = textContent.lastIndexOf(symbol);
    
    // Get the current selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Find the trigger text to remove (from @ or # to current cursor position)
    let triggerText = '';
    let triggerStartNode = null;
    let triggerStartOffset = 0;
    
    // Walk backwards from current position to find the start of the trigger
    const walker = document.createTreeWalker(
      searchInputRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let currentPos = 0;
    let node;
    const cursorPosition = getCursorPosition(searchInputRef.current, range);
    
    while (node = walker.nextNode()) {
      const nodeLength = node.length;
      if (currentPos + nodeLength >= cursorPosition) {
        // Found the text node containing the cursor
        const offsetInNode = cursorPosition - currentPos;
        
        // Check if this node contains the trigger symbol
        const nodeText = node.textContent;
        const symbolPosInNode = nodeText.lastIndexOf(symbol);
        
        if (symbolPosInNode !== -1 && symbolPosInNode < offsetInNode) {
          // Found the trigger text in this node
          triggerStartNode = node;
          triggerStartOffset = symbolPosInNode;
          triggerText = nodeText.substring(symbolPosInNode, offsetInNode);
        }
        break;
      }
      currentPos += nodeLength;
    }
    
    // Remove the trigger text
    if (triggerStartNode) {
      const triggerRange = document.createRange();
      triggerRange.setStart(triggerStartNode, triggerStartOffset);
      triggerRange.setEnd(range.startContainer, range.startOffset);
      triggerRange.deleteContents();
    }
    
    // Create the new tag HTML
    const tagHtml = createFormattedTag(name, type);
    
    // Create a temporary container to hold the new tag
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tagHtml;
    const newTagElement = tempDiv.firstElementChild;
    
    // Insert the new tag at the current cursor position
    range.insertNode(newTagElement);
    
    // Add a space after the tag
    const spaceNode = document.createTextNode(' ');
    range.setStartAfter(newTagElement);
    range.insertNode(spaceNode);
    
    // Set cursor position after the space and reset formatting state
    range.setStartAfter(spaceNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // CRITICAL FIX: Reset formatting state after tag insertion
    // Clear any existing selection and ensure clean cursor state
    selection.removeAllRanges();
    const cleanRange = document.createRange();
    cleanRange.setStartAfter(spaceNode);
    cleanRange.collapse(true);
    selection.addRange(cleanRange);
    
    // Force the contenteditable to reset its formatting state
    searchInputRef.current.blur();
    searchInputRef.current.focus();
    
    // Update the search query state
    setSearchQuery(searchInputRef.current.innerHTML);
    
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
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle fade-in animation
  useEffect(() => {
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
              <div
                ref={searchInputRef}
                contentEditable="true"
                onInput={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="search-input"
                data-placeholder="Ask anything or @mention a specific course..."
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