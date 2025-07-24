import React from 'react';
import './Home.css';

const Home = ({ onNavigateToAssignment }) => {
  const assignmentTypes = [
    {
      id: 'assignment',
      title: 'Limit Evaluation',
      description: 'Practice evaluating limits with step-by-step guidance',
      subject: 'Calculus',
      difficulty: 'Intermediate'
    },
    {
      id: 'multi-part-assignment',
      title: 'Multi-Part: Differential Equations',
      description: 'Solve a complete Laplace transform problem with guided parts',
      subject: 'Differential Equations',
      difficulty: 'Advanced'
    },
    {
      id: 'socratic',
      title: 'Socratic Dialogue',
      description: 'Explore linear independence in ODEs through guided questioning',
      subject: 'Differential Equations',
      difficulty: 'Advanced'
    }
  ];

  return (
    <div className="home-container">
      
      <main className="home-main">
        <div className="home-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome to Superclassroom</h1>
            <p className="welcome-subtitle">Choose an assignment to begin learning</p>
          </div>

          <div className="assignments-grid">
            {assignmentTypes.map((assignment) => (
              <div
                key={assignment.id}
                className="assignment-card"
                onClick={() => onNavigateToAssignment(assignment.id)}
              >
                <div className="assignment-card-header">
                  <h3 className="assignment-title">{assignment.title}</h3>
                  <span className="assignment-subject">{assignment.subject}</span>
                </div>
                <p className="assignment-description">{assignment.description}</p>
                <div className="assignment-card-footer">
                  <span className="assignment-difficulty">{assignment.difficulty}</span>
                  <div className="assignment-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 