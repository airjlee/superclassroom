import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { validateTextAnswer, validateMultipleChoice, getHintForPart } from '../utils/partValidation';
import './PartContent.css';
import '../../../shared/components.css';

const PartContent = ({ 
  part, 
  assignmentDefinition, 
  onAnswerChange, 
  onPartComplete,
  onShowChat,
  isSubmitted 
}) => {
  const [localAnswer, setLocalAnswer] = useState(part.answer || '');
  const [feedback, setFeedback] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const partDef = assignmentDefinition.parts[part.id];

  // Update local answer when part changes
  useEffect(() => {
    setLocalAnswer(part.answer || '');
    setFeedback(null);
    setAttemptCount(0);
    setShowHint(false);
  }, [part.id, part.answer]);

  const handleAnswerChange = (value) => {
    setLocalAnswer(value);
    onAnswerChange(part.id, value);
    if (feedback) {
      setFeedback(null); // Clear feedback when user starts typing again
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let validation;
    if (partDef.inputType === 'multiple-choice') {
      validation = validateMultipleChoice(localAnswer, partDef.correctAnswer);
    } else {
      validation = validateTextAnswer(localAnswer, partDef.correctAnswer, partDef.inputType);
    }

    setFeedback(validation);
    setAttemptCount(prev => prev + 1);

    if (validation.isCorrect) {
      onPartComplete(part.id, localAnswer);
    } else if (!validation.isEmpty) {
      // Show chat for help if answer is wrong
      setTimeout(() => {
        onShowChat && onShowChat(part.id, localAnswer);
      }, 1000);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const renderTextInput = () => (
    <div className="input-section">
      <label className="input-label" htmlFor={`part-${part.id}-input`}>
        {partDef.content.prompt}
      </label>
      
      {partDef.inputType === 'mathematical' ? (
        <div className="math-input-container">
          <input
            id={`part-${part.id}-input`}
            type="text"
            className="math-input"
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your mathematical expression..."
            disabled={part.completed}
          />
          <div className="math-preview">
            {localAnswer && (
              <div className="preview-content">
                <span className="preview-label">Preview:</span>
                <InlineMath math={localAnswer} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <textarea
          id={`part-${part.id}-input`}
          className="text-input"
          value={localAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="Enter your answer..."
          rows={4}
          disabled={part.completed}
        />
      )}
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="multiple-choice-section">
      <p className="choice-prompt">{partDef.content.prompt}</p>
      
      <div className="options-grid">
        {partDef.content.options.map(option => (
          <div
            key={option.id}
            className={`option-card ${localAnswer === option.id ? 'selected' : ''} ${
              part.completed ? 'disabled' : ''
            }`}
            onClick={() => !part.completed && handleAnswerChange(option.id)}
          >
            <div className="option-header">
              <span className="option-letter-base option-letter-circular">{option.id}</span>
              <span className="option-label">{option.label}</span>
            </div>
            
            {option.image && (
              <div className="option-image">
                <img 
                  src={`/graphs/${option.image}`} 
                  alt={option.description}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <p className="option-description">{option.description}</p>
            
            {localAnswer === option.id && (
              <div className="selection-indicator">
                <span className="checkmark">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderProblemStatement = () => {
    if (!partDef.content.problemStatement) return null;

    return (
      <div className="problem-statement">
        <h3 className="problem-title">{partDef.content.problemStatement}</h3>
        
        {partDef.content.equation && (
          <div className="equation-display">
            <BlockMath math={partDef.content.equation} />
          </div>
        )}
        
        {partDef.content.initialConditions && (
          <div className="initial-conditions">
            <span className="conditions-label">Initial conditions: </span>
            <InlineMath math={partDef.content.initialConditions} />
          </div>
        )}
      </div>
    );
  };

  const hint = getHintForPart(partDef, attemptCount);

  return (
    <div className="part-content-container">
      {/* Part Header */}
      <div className="part-header">
        <div className="part-info">
          <h1 className="part-title">
            Part {part.id.toUpperCase()}: {partDef.title}
          </h1>
          <p className="part-instruction">{partDef.instruction}</p>
        </div>
        
        {part.completed && (
          <div className="completion-badge">
            <span className="badge-icon">✓</span>
            <span className="badge-text">Completed</span>
          </div>
        )}
      </div>

      {/* Problem Statement */}
      {renderProblemStatement()}

      {/* Main Content */}
      <div className="part-main-content">
        <form onSubmit={handleSubmit} className="answer-form">
          {partDef.inputType === 'multiple-choice' ? renderMultipleChoice() : renderTextInput()}
          
          {/* Submit Button */}
          {!part.completed && (
            <div className="submit-section">
              <button
                type="submit"
                className={`btn-submit ${localAnswer ? 'active' : ''}`}
                disabled={!localAnswer}
              >
                Submit Answer
              </button>
            </div>
          )}
        </form>

        {/* Feedback */}
        {feedback && (
          <div className={`feedback-base ${feedback.isCorrect ? 'feedback-success' : 'feedback-error'}`}>
            <span className="feedback-icon">
              {feedback.isCorrect ? '✓' : '✗'}
            </span>
            <span className="feedback-text">{feedback.feedback}</span>
          </div>
        )}

        {/* Hints */}
        {hint && attemptCount > 0 && (
          <div className="hint-section">
            <button
              type="button"
              className="hint-toggle"
              onClick={toggleHint}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            {showHint && (
              <div className="hint-content">
                <span className="hint-icon">💡</span>
                <p className="hint-text">{hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Next Part Button */}
        {part.completed && (
          <div className="next-section">
            <p className="completion-message">
              Great job! You can continue to the next part.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartContent; 