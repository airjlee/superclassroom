import React from 'react';
import './Header.css';

const Header = ({ currentPage, onNavigateHome, onNavigateToCreator, onNavigateToDashboard, onShowCreateDropdown, showCreateDropdown }) => {
  // Show Back Home button if not on the home page
  const showBackButton = currentPage !== 'home';
  
  // Show create button on dashboard pages
  const showCreateButton = currentPage === 'dashboard' || currentPage === 'course-dashboard';

  return (
    <header className="socratic-header">
      <button
        className="logo-button"
        onClick={onNavigateHome}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
        <span className="logo">superclassroom</span>
        </button>
      
      <div className="header-actions">
        {currentPage === 'home' && (
          <>
            {onNavigateToCreator && (
              <button className="create-button" onClick={onNavigateToCreator}>
                Create Assignment
              </button>
            )}
            {onNavigateToDashboard && (
              <button className="dashboard-button" onClick={onNavigateToDashboard}>
                Teacher Dashboard
              </button>
            )}
          </>
        )}
        
        {showCreateButton && (
          <div className="create-dropdown-container">
            <button 
              className="create-button"
              onClick={onShowCreateDropdown}
            >
              <span className="create-icon">+</span>
              Create
              <span className="dropdown-arrow">▾</span>
            </button>
            
            {showCreateDropdown && (
              <div className="create-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => onNavigateToCreator('SuperConcept')}
                >
                  <span className="item-icon">📚</span>
                  <div className="item-content">
                    <span className="item-title">SuperConcept</span>
                    <span className="item-description">Interactive lesson with AI guidance</span>
                  </div>
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => onNavigateToCreator('SuperQuiz')}
                >
                  <span className="item-icon">📝</span>
                  <div className="item-content">
                    <span className="item-title">SuperQuiz</span>
                    <span className="item-description">Assessment with intelligent feedback</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
        
        {showBackButton && (
          <button className="back-button" onClick={onNavigateHome}>
            ← Back to Home
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;