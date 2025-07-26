/**
 * Validate a text/mathematical input answer
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {string} inputType - Type of input ('text', 'mathematical')
 * @returns {Object} - Validation result with isCorrect and feedback
 */
export const validateTextAnswer = (userAnswer, correctAnswer, inputType = 'text') => {
  if (!userAnswer || !userAnswer.trim()) {
    return {
      isCorrect: false,
      feedback: 'Please enter an answer.',
      isEmpty: true
    };
  }

  const normalizedUser = normalizeAnswer(userAnswer, inputType);
  const normalizedCorrect = normalizeAnswer(correctAnswer, inputType);
  
  const isCorrect = normalizedUser === normalizedCorrect;
  
  return {
    isCorrect,
    feedback: isCorrect 
      ? 'Correct! Well done.' 
      : 'Incorrect. Please check your work and try again.',
    isEmpty: false
  };
};

/**
 * Validate a multiple choice answer
 * @param {string} userAnswer - User's selected option
 * @param {string} correctAnswer - Correct option
 * @returns {Object} - Validation result
 */
export const validateMultipleChoice = (userAnswer, correctAnswer) => {
  if (!userAnswer) {
    return {
      isCorrect: false,
      feedback: 'Please select an option.',
      isEmpty: true
    };
  }

  const isCorrect = userAnswer === correctAnswer;
  
  return {
    isCorrect,
    feedback: isCorrect 
      ? 'Correct! You selected the right graph.' 
      : 'Incorrect. Consider the mathematical behavior of the solution.',
    isEmpty: false
  };
};

/**
 * Normalize answers for comparison (removes whitespace, standardizes format)
 * @param {string} answer - Answer to normalize
 * @param {string} inputType - Type of input
 * @returns {string} - Normalized answer
 */
const normalizeAnswer = (answer, inputType) => {
  if (!answer) return '';
  
  let normalized = answer.trim();
  
  if (inputType === 'mathematical') {
    // Remove extra spaces around operators and parentheses
    normalized = normalized.replace(/\s+/g, ' ');
    normalized = normalized.replace(/\s*([+\-*/=(){}[\]])\s*/g, '$1');
    // Standardize common mathematical expressions
    normalized = normalized.replace(/\*\*/g, '^'); // Convert ** to ^
    normalized = normalized.replace(/\be\b/g, 'e'); // Ensure 'e' is consistent
  }
  
  return normalized.toLowerCase();
};

/**
 * Get hints for a part based on user's attempts
 * @param {Object} part - The part object
 * @param {number} attemptCount - Number of attempts made
 * @returns {string|null} - Hint text or null if no hint available
 */
export const getHintForPart = (part, attemptCount) => {
  if (!part.hints || part.hints.length === 0) {
    return null;
  }
  
  // Show hints progressively based on attempt count
  const hintIndex = Math.min(attemptCount - 1, part.hints.length - 1);
  return attemptCount > 0 ? part.hints[hintIndex] : null;
};

/**
 * Check if answer is partially correct (for more nuanced feedback)
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {string} inputType - Type of input
 * @returns {Object} - Partial correctness analysis
 */
export const checkPartialCorrectness = (userAnswer, correctAnswer, inputType) => {
  if (!userAnswer || !correctAnswer) {
    return { isPartiallyCorrect: false, feedback: '' };
  }

  if (inputType === 'mathematical') {
    const userNorm = normalizeAnswer(userAnswer, inputType);
    const correctNorm = normalizeAnswer(correctAnswer, inputType);
    
    // Check for common partial matches
    const commonTerms = findCommonTerms(userNorm, correctNorm);
    const hasCorrectStructure = checkMathematicalStructure(userNorm, correctNorm);
    
    if (commonTerms.length > 0 || hasCorrectStructure) {
      return {
        isPartiallyCorrect: true,
        feedback: 'You\'re on the right track! Check your calculation again.'
      };
    }
  }
  
  return { isPartiallyCorrect: false, feedback: '' };
};

/**
 * Find common mathematical terms between user and correct answers
 * @param {string} userAnswer - Normalized user answer
 * @param {string} correctAnswer - Normalized correct answer
 * @returns {Array} - Array of common terms
 */
const findCommonTerms = (userAnswer, correctAnswer) => {
  const userTerms = userAnswer.match(/[a-z]+|\d+|[+\-*/^()]/g) || [];
  const correctTerms = correctAnswer.match(/[a-z]+|\d+|[+\-*/^()]/g) || [];
  
  return userTerms.filter(term => correctTerms.includes(term));
};

/**
 * Check if mathematical structure is similar
 * @param {string} userAnswer - Normalized user answer
 * @param {string} correctAnswer - Normalized correct answer  
 * @returns {boolean} - Whether structure is similar
 */
const checkMathematicalStructure = (userAnswer, correctAnswer) => {
  // Simple structure check - count operators and parentheses
  const userOps = (userAnswer.match(/[+\-*/^()]/g) || []).length;
  const correctOps = (correctAnswer.match(/[+\-*/^()]/g) || []).length;
  
  // Allow some variance in operator count
  return Math.abs(userOps - correctOps) <= 2;
};

/**
 * Validate all answers in the assignment
 * @param {Object} parts - All parts with answers
 * @param {Object} assignmentDefinition - Assignment definition with correct answers
 * @returns {Object} - Overall validation result
 */
export const validateAssignment = (parts, assignmentDefinition) => {
  const results = {};
  let allCorrect = true;
  
  Object.keys(parts).forEach(partId => {
    const part = parts[partId];
    const definition = assignmentDefinition.parts[partId];
    
    if (!part.answer && part.inputType !== 'multiple-choice') {
      results[partId] = { isCorrect: false, isEmpty: true };
      allCorrect = false;
    } else if (definition.inputType === 'multiple-choice') {
      results[partId] = validateMultipleChoice(part.answer, definition.correctAnswer);
      if (!results[partId].isCorrect) allCorrect = false;
    } else {
      results[partId] = validateTextAnswer(part.answer, definition.correctAnswer, definition.inputType);
      if (!results[partId].isCorrect) allCorrect = false;
    }
  });
  
  return {
    results,
    allCorrect,
    completedCount: Object.values(results).filter(r => r.isCorrect).length,
    totalCount: Object.keys(results).length
  };
}; 