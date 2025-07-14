import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Assignment from './components/Assignment/Assignment';
import SocraticDialogue from './components/SocraticDialogue/SocraticDialogue';
import AssignmentCreator from './components/AssignmentCreator/AssignmentCreator';
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard';
import CourseDashboard from './components/TeacherDashboard/CourseDashboard';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const handleCreateSelection = (type) => {
    setShowCreateDropdown(false);
    setCurrentPage('create-assignment');
  };

  // Close dropdown when clicking outside or changing pages
  useEffect(() => {
    setShowCreateDropdown(false);
  }, [currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'assignment':
        return <Assignment onNavigateHome={() => setCurrentPage('home')} />;
      case 'socratic':
        return <SocraticDialogue onNavigateHome={() => setCurrentPage('home')} />;
      case 'create-assignment':
        return <AssignmentCreator />;
      case 'dashboard':
        return <TeacherDashboard onNavigateToCourse={(courseId) => {
          setCurrentCourseId(courseId);
          setCurrentPage('course-dashboard');
        }} />;
      case 'course-dashboard':
        return <CourseDashboard 
          courseId={currentCourseId}
          onNavigateBack={() => setCurrentPage('dashboard')}
          onNavigateToCreate={(type) => setCurrentPage('create-assignment')}
        />;
      default:
        return <Home onNavigateToAssignment={(type) => setCurrentPage(type)} />;
    }
  };

  return (
    <div className="App">
      {currentPage !== 'create-assignment' && (
        <Header 
          currentPage={currentPage} 
          onNavigateHome={() => setCurrentPage('home')} 
          onNavigateToCreator={handleCreateSelection}
          onNavigateToDashboard={() => setCurrentPage('dashboard')}
          onShowCreateDropdown={() => setShowCreateDropdown(!showCreateDropdown)}
          showCreateDropdown={showCreateDropdown}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;