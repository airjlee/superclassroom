import React from 'react';
import { getPartStatus, calculateProgress } from '../utils/progressUtils';
import './PartsSidebar.css';

const PartsSidebar = ({ 
  parts, 
  currentPartId, 
  onPartSelect, 
  assignmentTitle,
  assignmentDescription 
}) => {
  const progress = calculateProgress(parts);
  const partIds = Object.keys(parts).sort();

  const handlePartClick = (partId) => {
    const part = parts[partId];
    if (!part.locked) {
      onPartSelect(partId);
    }
  };

  // Enhanced status icons with better symbols
  const getStatusIcon = (part, currentPartId) => {
    if (part.completed) {
      return '✓';
    }
    
    if (part.id === currentPartId) {
      return '▶';
    }
    
    if (part.locked) {
      return '●';
    }
    
    return '○';
  };

  const getStatusColor = (part, currentPartId) => {
    if (part.completed) {
      return '#10b981'; // green-500
    }
    
    if (part.id === currentPartId) {
      return '#3b82f6'; // blue-500
    }
    
    if (part.locked) {
      return '#9ca3af'; // gray-400
    }
    
    return '#6b7280'; // gray-500
  };

  return (
    <div className="parts-sidebar">
      {/* Assignment Header */}
      <div className="sidebar-header">
        <h2 className="assignment-title">{assignmentTitle}</h2>
        <p className="assignment-description">{assignmentDescription}</p>
        
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-label">
            <span>Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-stats">
            {Object.values(parts).filter(p => p.completed).length} of {partIds.length} completed
          </div>
        </div>
      </div>

      {/* Parts List */}
      <div className="parts-list">
        <h3 className="parts-title">Assignment Parts</h3>
        
        {partIds.map(partId => {
          const part = parts[partId];
          const isClickable = !part.locked;
          const isActive = part.id === currentPartId;
          const isCompleted = part.completed;
          const isLocked = part.locked;
          
          return (
            <div
              key={partId}
              className={`part-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handlePartClick(partId)}
              role="button"
              tabIndex={isClickable ? 0 : -1}
              aria-disabled={!isClickable}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                  e.preventDefault();
                  handlePartClick(partId);
                }
              }}
            >
              {/* Status Icon */}
              <div className="part-status">
                <span 
                  className="status-icon"
                  style={{ color: getStatusColor(part, currentPartId) }}
                  aria-label={isCompleted ? 'completed' : isActive ? 'current' : isLocked ? 'locked' : 'available'}
                >
                  {getStatusIcon(part, currentPartId)}
                </span>
              </div>

              {/* Part Content */}
              <div className="part-content">
                <div className="part-header">
                  <span className="part-letter">Part {partId.toUpperCase()}</span>
                  {isCompleted && (
                    <span className="completion-badge">Done</span>
                  )}
                </div>
                <div className="part-title">{part.title}</div>
                
                {/* Show dependency info for locked parts */}
                {isLocked && part.dependsOn && part.dependsOn.length > 0 && (
                  <div className="dependency-info">
                    <span className="dependency-icon">⚠</span>
                    Complete part{part.dependsOn.length > 1 ? 's' : ''} {part.dependsOn.map(dep => dep.toUpperCase()).join(', ')} first
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Summary */}
      <div className="sidebar-footer">
        <div className="completion-summary">
          {progress === 100 ? (
            <div className="completion-message success">
              <span className="success-icon">🎉</span>
              <span>Assignment Complete!</span>
            </div>
          ) : (
            <div className="completion-message">
              <span className="remaining-count">
                {partIds.length - Object.values(parts).filter(p => p.completed).length}
              </span>
              <span className="remaining-text">parts remaining</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartsSidebar; 