import React, { useState } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Assignment from './components/Assignment/Assignment';
import SocraticDialogue from './components/SocraticDialogue/SocraticDialogue';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'assignment':
        return <Assignment onNavigateHome={() => setCurrentPage('home')} />;
      case 'socratic':
        return <SocraticDialogue onNavigateHome={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigateToAssignment={(type) => setCurrentPage(type)} />;
    }
  };

  return (
    <div className="App">
      <Header 
        currentPage={currentPage} 
        onNavigateHome={() => setCurrentPage('home')} 
      />
      {renderPage()}
    </div>
  );
}

export default App;