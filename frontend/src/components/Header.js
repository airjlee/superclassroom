import React from 'react';
import './Header.css';

const Header = ({ currentPage, onNavigateHome }) => {
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
      {showBackButton && (
        <button className="back-button" onClick={onNavigateHome}>
          ← Back to Home
        </button>
      )}
    </header>
  );
};

export default Header;