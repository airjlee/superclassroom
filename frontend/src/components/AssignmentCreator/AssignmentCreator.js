import React, { useState } from 'react';
import './AssignmentCreator.css';
import QuestionBuilder from './QuestionBuilder';

const AssignmentCreator = () => {
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    difficulty: 'medium',
    timeLimit: 30,
    questions: []
  });

  const [currentStep, setCurrentStep] = useState('details'); // 'details', 'questions', 'preview'
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);

  const handleAssignmentChange = (field, value) => {
    setAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addQuestion = (question) => {
    setAssignment(prev => ({
      ...prev,
      questions: [...prev.questions, { ...question, id: Date.now() }]
    }));
    setShowQuestionBuilder(false);
  };

  const removeQuestion = (questionId) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handlePublish = () => {
    // Here you would save the assignment to your backend
    console.log('Publishing assignment:', assignment);
    alert('Assignment published successfully!');
  };

  const isValidAssignment = () => {
    return assignment.title.trim() && 
           assignment.description.trim() && 
           assignment.subject.trim() && 
           assignment.questions.length > 0;
  };

  return (
    <div className="assignment-creator">
      <header className="creator-header">
        <div className="logo">superclassroom</div>
        <div className="header-actions">
          <button className="btn-secondary">Save Draft</button>
          <button 
            className={`btn-primary ${!isValidAssignment() ? 'disabled' : ''}`}
            onClick={handlePublish}
            disabled={!isValidAssignment()}
          >
            Publish Assignment
          </button>
        </div>
      </header>

      <div className="creator-content">
        {/* Navigation Steps */}
        <div className="step-navigation">
          <div 
            className={`step ${currentStep === 'details' ? 'active' : ''}`}
            onClick={() => setCurrentStep('details')}
          >
            <span className="step-number">1</span>
            <span className="step-label">Assignment Details</span>
          </div>
          <div 
            className={`step ${currentStep === 'questions' ? 'active' : ''}`}
            onClick={() => setCurrentStep('questions')}
          >
            <span className="step-number">2</span>
            <span className="step-label">Add Questions</span>
          </div>
          <div 
            className={`step ${currentStep === 'preview' ? 'active' : ''}`}
            onClick={() => setCurrentStep('preview')}
          >
            <span className="step-number">3</span>
            <span className="step-label">Preview & Publish</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {currentStep === 'details' && (
            <div className="assignment-details">
              <h2>Assignment Details</h2>
              
              <div className="form-group">
                <label htmlFor="title">Assignment Title *</label>
                <input
                  type="text"
                  id="title"
                  value={assignment.title}
                  onChange={(e) => handleAssignmentChange('title', e.target.value)}
                  placeholder="Enter assignment title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={assignment.description}
                  onChange={(e) => handleAssignmentChange('description', e.target.value)}
                  placeholder="Describe what students will learn and accomplish"
                  className="form-textarea"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    value={assignment.subject}
                    onChange={(e) => handleAssignmentChange('subject', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="calculus">Calculus</option>
                    <option value="algebra">Algebra</option>
                    <option value="geometry">Geometry</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="computer-science">Computer Science</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty Level</label>
                  <select
                    id="difficulty"
                    value={assignment.difficulty}
                    onChange={(e) => handleAssignmentChange('difficulty', e.target.value)}
                    className="form-select"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="timeLimit">Time Limit (minutes)</label>
                  <input
                    type="number"
                    id="timeLimit"
                    value={assignment.timeLimit}
                    onChange={(e) => handleAssignmentChange('timeLimit', parseInt(e.target.value))}
                    min="5"
                    max="180"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="step-actions">
                <button 
                  className="btn-primary"
                  onClick={() => setCurrentStep('questions')}
                  disabled={!assignment.title.trim() || !assignment.description.trim() || !assignment.subject.trim()}
                >
                  Continue to Questions
                </button>
              </div>
            </div>
          )}

          {currentStep === 'questions' && (
            <div className="questions-section">
              <div className="section-header">
                <h2>Assignment Questions</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowQuestionBuilder(true)}
                >
                  Add Question
                </button>
              </div>

              {assignment.questions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No questions added yet</h3>
                  <p>Start building your assignment by adding your first question.</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowQuestionBuilder(true)}
                  >
                    Add Your First Question
                  </button>
                </div>
              ) : (
                <div className="questions-list">
                  {assignment.questions.map((question, index) => (
                    <div key={question.id} className="question-card">
                      <div className="question-header">
                        <span className="question-number">Question {index + 1}</span>
                        <span className="question-type">{question.type}</span>
                        <button 
                          className="btn-remove"
                          onClick={() => removeQuestion(question.id)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="question-preview">
                        <p>{question.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {assignment.questions.length > 0 && (
                <div className="step-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setCurrentStep('details')}
                  >
                    Back
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => setCurrentStep('preview')}
                  >
                    Preview Assignment
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'preview' && (
            <div className="preview-section">
              <h2>Assignment Preview</h2>
              <div className="assignment-summary">
                <h3>{assignment.title}</h3>
                <p>{assignment.description}</p>
                <div className="assignment-meta">
                  <span>Subject: {assignment.subject}</span>
                  <span>Difficulty: {assignment.difficulty}</span>
                  <span>Time Limit: {assignment.timeLimit} minutes</span>
                  <span>Questions: {assignment.questions.length}</span>
                </div>
              </div>

              <div className="questions-preview">
                {assignment.questions.map((question, index) => (
                  <div key={question.id} className="preview-question">
                    <h4>Question {index + 1}</h4>
                    <p>{question.text}</p>
                    {question.type === 'multiple-choice' && (
                      <div className="options-preview">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="option-preview">
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="step-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentStep('questions')}
                >
                  Back to Questions
                </button>
                <button 
                  className="btn-primary"
                  onClick={handlePublish}
                >
                  Publish Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question Builder Modal */}
      {showQuestionBuilder && (
        <QuestionBuilder
          onSave={addQuestion}
          onCancel={() => setShowQuestionBuilder(false)}
        />
      )}
    </div>
  );
};

export default AssignmentCreator; 