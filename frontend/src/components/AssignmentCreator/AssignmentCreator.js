import React, { useState, useEffect } from 'react';
import './AssignmentCreator.css';

const AssignmentCreator = ({ onNavigateBack }) => {
  const [isFadingIn, setIsFadingIn] = useState(true);
  
  // Handle fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const [assignment, setAssignment] = useState({
    title: '',
    description: 'This assignment covers the fundamental concepts of limits and continuity in calculus.',
    startDate: '2025-07-20',
    startTime: '09:00',
    dueDate: '2025-07-24',
    dueTime: '23:59',
    courseTitle: 'Calculus I',
    sections: [
      {
        id: 'superquiz-1',
        type: 'superquiz',
        title: 'Superquiz 1'
      },
      {
        id: 'superconcept-1',
        type: 'superconcept',
        title: 'Superconcept 1'
      }
    ]
  });

  const [draggedSection, setDraggedSection] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [dateInputValue, setDateInputValue] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [aiStrictness, setAiStrictness] = useState(5);
  const [aiSensitivity, setAiSensitivity] = useState(5);
  const [aiPatience, setAiPatience] = useState(5);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleAssignmentChange = (field, value) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDragStart = (e, sectionId) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragOver = (e, sectionId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (sectionId !== draggedSection) {
      setDragOverSection(sectionId);
    }
  };

  const handleDragLeave = (e, sectionId) => {
    if (sectionId === dragOverSection) {
      setDragOverSection(null);
    }
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedSection(null);
    setDragOverSection(null);
  };

  const handleDrop = (e, targetSectionId) => {
    e.preventDefault();
    if (draggedSection && draggedSection !== targetSectionId) {
      const sections = [...assignment.sections];
      const draggedIndex = sections.findIndex(s => s.id === draggedSection);
      const targetIndex = sections.findIndex(s => s.id === targetSectionId);
      
      const [draggedItem] = sections.splice(draggedIndex, 1);
      sections.splice(targetIndex, 0, draggedItem);
      
      setAssignment(prev => ({
        ...prev,
        sections
      }));
    }
    setDraggedSection(null);
    setDragOverSection(null);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate publishing process
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      
      // Include both slider values in the assignment data
      const assignmentData = {
        ...assignment,
        aiSettings: {
          strictness: aiStrictness,
          sensitivity: aiSensitivity,
          patience: aiPatience,
          instructions: instructions
        }
      };
      
      console.log('Publishing assignment with AI settings:', assignmentData);
      
      // Reset published state after 3 seconds
      setTimeout(() => {
        setIsPublished(false);
      }, 3000);
    }, 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getDueDateMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDueDateDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleDateFocus = () => {
    setIsEditingDate(true);
    setDateInputValue('');
  };

  const handleDateBlur = () => {
    setIsEditingDate(false);
    setDateInputValue('');
  };

  const handleDateKeyPress = (e) => {
    if (e.key === 'Enter') {
      // For demo: change to July 31 when anything is typed and enter is pressed
      handleAssignmentChange('dueDate', '2025-07-31');
      setIsEditingDate(false);
      setDateInputValue('');
    } else if (e.key === 'Escape') {
      setIsEditingDate(false);
      setDateInputValue('');
    }
  };

  return (
    <div className={`assignment-creator-page ${isFadingIn ? '' : 'fade-in'}`}>
      <div className="assignment-creator-header">
        <div className="assignment-creator-header-info">
          <div className="assignment-title-section">
            <div className="title-and-badge">
              <div className="assignment-badges">
                <span className="assignment-type-badge superconcept">
                  <span className="material-icons assignment-type-icon">article</span>
                  Superconcept
                </span>
                <span className="assignment-type-badge superquiz">
                  <span className="material-icons assignment-type-icon">edit</span>
                  Superquiz
                </span>
                <span className="assignment-type-badge add">
                  <span className="material-icons assignment-type-icon">add</span>
                  Add
                </span>
              </div>
              <input
                type="text"
                className="assignment-title-input"
                value={assignment.title}
                onChange={(e) => handleAssignmentChange('title', e.target.value)}
                placeholder="Assignment Title"
              />
            </div>
            <div className="header-actions">
              <button className="action-button secondary" onClick={onNavigateBack}>
                <span className="material-icons">close</span>
                Cancel
              </button>
              <button 
                className={`action-button primary ${isPublishing ? 'publishing' : ''} ${isPublished ? 'published' : ''}`}
                onClick={handlePublish}
                disabled={isPublishing || isPublished}
              >
                {isPublishing ? (
                  <div className="publish-spinner"></div>
                ) : isPublished ? (
                  <>
                    <span className="material-icons">check</span>
                    Published
                  </>
                ) : (
                  <>
                    <span className="material-icons">publish</span>
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
          <input
            type="text"
            className="assignment-course-input"
            value={assignment.courseTitle}
            onChange={(e) => handleAssignmentChange('courseTitle', e.target.value)}
            placeholder="Course Title"
          />
          <textarea
            className="assignment-description-input"
            value={assignment.description}
            onChange={(e) => handleAssignmentChange('description', e.target.value)}
            placeholder="Describe what students will learn and accomplish"
            rows="3"
          />
        </div>

        <div className="assignment-meta">
          <div className="date-section">
            <div className="date-item">
              <div className="date-label">Start Date</div>
              <div className="due-date-section">
                <div className="due-date-calendar">
                  <div className="due-date-month">{getDueDateMonth(assignment.startDate)}</div>
                  <div className="due-date-day">{getDueDateDay(assignment.startDate)}</div>
                </div>
                <div className="due-date-details">
                  <input
                    type="text"
                    className="due-date-title-input"
                    value={formatDate(assignment.startDate)}
                    readOnly
                  />
                  <div className="due-date-time">{formatTime(assignment.startTime)}</div>
                </div>
              </div>
            </div>
            <div className="date-item">
              <div className="date-label">Due Date</div>
              <div className="due-date-section">
                <div className="due-date-calendar">
                  <div className="due-date-month">{getDueDateMonth(assignment.dueDate)}</div>
                  <div className="due-date-day">{getDueDateDay(assignment.dueDate)}</div>
                </div>
                <div className="due-date-details">
                  <input
                    type="text"
                    className="due-date-title-input"
                    value={isEditingDate ? dateInputValue : formatDate(assignment.dueDate)}
                    onChange={(e) => setDateInputValue(e.target.value)}
                    onFocus={handleDateFocus}
                    onBlur={handleDateBlur}
                    onKeyDown={handleDateKeyPress}
                    placeholder="Due Date"
                  />
                  <div className="due-date-time">{formatTime(assignment.dueTime)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="assignment-creator-content">
        <div className="divider"></div>
        
        <div className="settings-sections">
          <div className="ai-settings-section">
            <h3 className="ai-settings-title">
              <span className="material-icons ai-settings-icon">smart_toy</span>
              AI Settings
            </h3>
            <div className="ai-strictness-container">
              <div className="ai-strictness-header">
                <span className="ai-strictness-label">Strictness</span>
                <span className="ai-strictness-value">{aiStrictness}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={aiStrictness}
                onChange={(e) => setAiStrictness(parseInt(e.target.value))}
                className="ai-strictness-slider"
              />
              <div className="ai-strictness-description">
                Controls how strictly the AI evaluates student responses. Higher values mean more rigorous assessment.
              </div>
              
              {/* NEW: Second Slider */}
              <div className="ai-sensitivity-header">
                <span className="ai-sensitivity-label">Sensitivity</span>
                <span className="ai-sensitivity-value">{aiSensitivity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={aiSensitivity}
                onChange={(e) => setAiSensitivity(parseInt(e.target.value))}
                className="ai-sensitivity-slider"
              />
              <div className="ai-sensitivity-description">
                Controls how sensitive the AI is to student confusion. Higher values trigger more help.
              </div>
              
              {/* NEW: Third Slider */}
              <div className="ai-patience-header">
                <span className="ai-patience-label">Patience</span>
                <span className="ai-patience-value">{aiPatience}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={aiPatience}
                onChange={(e) => setAiPatience(parseInt(e.target.value))}
                className="ai-patience-slider"
              />
              <div className="ai-patience-description">
                Controls how long the AI waits before offering hints. Higher values mean more time for students to think.
              </div>
              
              <div className="instructions-section">
                {!showInstructions ? (
                  <button 
                    className="add-instructions-button"
                    onClick={() => setShowInstructions(true)}
                  >
                    <span className="material-icons">add</span>
                    Add Instructions
                  </button>
                ) : (
                  <div className="instructions-editor">
                    <div className="instructions-header">
                      <span className="instructions-label">Instructions</span>
                      <button 
                        className="close-instructions-button"
                        onClick={() => setShowInstructions(false)}
                      >
                        <span className="material-icons">close</span>
                      </button>
                    </div>
                    <textarea
                      className="instructions-textarea"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Add specific instructions for students..."
                      rows="4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="sections-container">
            <h3 className="components-title">
              <span className="material-icons components-icon">widgets</span>
              Components
            </h3>
            <div className="sections-grid">
              {assignment.sections.map((section) => (
                <div
                  key={section.id}
                  className={`section-card ${section.type} ${
                    draggedSection === section.id ? 'dragging' : ''
                  } ${
                    dragOverSection === section.id ? 'drag-over' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section.id)}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={(e) => handleDragLeave(e, section.id)}
                  onDrop={(e) => handleDrop(e, section.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="section-card-content">
                    <span className="material-icons section-icon">
                      {section.type === 'superconcept' ? 'article' : 'edit'}
                    </span>
                    <span className="section-title">{section.title}</span>
                  </div>
                </div>
              ))}
              <button className="add-block-button">
                <span className="material-icons">add</span>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCreator; 