import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './QuestionBuilder.css';

const QuestionBuilder = ({ onSave, onCancel }) => {
  const [question, setQuestion] = useState({
    type: 'multiple-choice',
    text: '',
    explanation: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    correctAnswer: '', // for text input questions
    points: 1
  });

  const [showMathPreview, setShowMathPreview] = useState(false);

  const handleQuestionChange = (field, value) => {
    setQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const setCorrectOption = (index) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index
      }))
    }));
  };

  const addOption = () => {
    if (question.options.length < 6) {
      setQuestion(prev => ({
        ...prev,
        options: [...prev.options, { text: '', isCorrect: false }]
      }));
    }
  };

  const removeOption = (index) => {
    if (question.options.length > 2) {
      setQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    // Validation
    if (!question.text.trim()) {
      alert('Please enter a question');
      return;
    }

    if (question.type === 'multiple-choice') {
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
      const allOptionsHaveText = question.options.every(opt => opt.text.trim());
      
      if (!hasCorrectAnswer) {
        alert('Please select the correct answer');
        return;
      }
      
      if (!allOptionsHaveText) {
        alert('Please fill in all answer options');
        return;
      }
    } else if (question.type === 'text-input' && !question.correctAnswer.trim()) {
      alert('Please enter the correct answer');
      return;
    }

    onSave(question);
  };

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: '🔘' },
    { value: 'text-input', label: 'Text Input', icon: '✏️' },
    { value: 'true-false', label: 'True/False', icon: '✅' }
  ];

  return (
    <div className="question-builder-overlay">
      <div className="question-builder">
        <div className="builder-header">
          <h3>Add Question</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="builder-content">
          {/* Question Type Selection */}
          <div className="form-group">
            <label>Question Type</label>
            <div className="question-type-grid">
              {questionTypes.map(type => (
                <button
                  key={type.value}
                  className={`type-option ${question.type === type.value ? 'selected' : ''}`}
                  onClick={() => handleQuestionChange('type', type.value)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="form-group">
            <label htmlFor="questionText">
              Question Text *
              <button 
                type="button"
                className="math-toggle"
                onClick={() => setShowMathPreview(!showMathPreview)}
              >
                {showMathPreview ? 'Hide' : 'Show'} Math Preview
              </button>
            </label>
            <textarea
              id="questionText"
              value={question.text}
              onChange={(e) => handleQuestionChange('text', e.target.value)}
              placeholder="Enter your question here. Use LaTeX for math: \\frac{1}{2} or \\lim_{x \\to 0}"
              className="form-textarea"
              rows="3"
            />
            {showMathPreview && question.text && (
              <div className="math-preview">
                <label>Preview:</label>
                <div className="preview-content">
                  {question.text.includes('\\') ? (
                    <BlockMath math={question.text} />
                  ) : (
                    <p>{question.text}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Question-specific content */}
          {question.type === 'multiple-choice' && (
            <div className="form-group">
              <label>Answer Options *</label>
              <div className="options-builder">
                {question.options.map((option, index) => (
                  <div key={index} className="option-row">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() => setCorrectOption(index)}
                      className="correct-radio"
                    />
                    <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder="Enter answer option"
                      className="option-input"
                    />
                    {question.options.length > 2 && (
                      <button 
                        type="button"
                        className="remove-option"
                        onClick={() => removeOption(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {question.options.length < 6 && (
                  <button 
                    type="button"
                    className="add-option"
                    onClick={addOption}
                  >
                    + Add Option
                  </button>
                )}
              </div>
            </div>
          )}

          {question.type === 'text-input' && (
            <div className="form-group">
              <label htmlFor="correctAnswer">Correct Answer *</label>
              <input
                type="text"
                id="correctAnswer"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                placeholder="Enter the correct answer"
                className="form-input"
              />
              <small className="form-hint">
                For numeric answers, enter exact values. For text, be specific about capitalization and spelling.
              </small>
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="form-group">
              <label>Correct Answer *</label>
              <div className="true-false-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="trueFalse"
                    value="true"
                    checked={question.correctAnswer === 'true'}
                    onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                  />
                  True
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="trueFalse"
                    value="false"
                    checked={question.correctAnswer === 'false'}
                    onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                  />
                  False
                </label>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="form-group">
            <label htmlFor="explanation">Explanation (Optional)</label>
            <textarea
              id="explanation"
              value={question.explanation}
              onChange={(e) => handleQuestionChange('explanation', e.target.value)}
              placeholder="Provide an explanation for the correct answer"
              className="form-textarea"
              rows="2"
            />
          </div>

          {/* Points */}
          <div className="form-group">
            <label htmlFor="points">Points</label>
            <input
              type="number"
              id="points"
              value={question.points}
              onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
              min="1"
              max="10"
              className="form-input points-input"
            />
          </div>
        </div>

        <div className="builder-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilder; 