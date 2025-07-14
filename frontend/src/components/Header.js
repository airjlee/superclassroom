import React from 'react';
import './Header.css';

const Header = ({ currentPage, onNavigateHome, onNavigateToCreator, onNavigateToDashboard }) => {
  // Show Back Home button if not on the home page
  const showBackButton = currentPage !== 'home';

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