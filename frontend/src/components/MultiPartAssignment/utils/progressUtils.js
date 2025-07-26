/**
 * Calculate the overall progress percentage for the assignment
 * @param {Object} parts - The parts object from state
 * @returns {number} - Progress percentage (0-100)
 */
export const calculateProgress = (parts) => {
  const partsList = Object.values(parts);
  const completed = partsList.filter(part => part.completed).length;
  const total = partsList.length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

/**
 * Check if a part can be accessed based on its dependencies
 * @param {string} partId - The ID of the part to check
 * @param {Object} parts - The parts object from state
 * @returns {boolean} - Whether the part can be accessed
 */
export const canAccessPart = (partId, parts) => {
  const part = parts[partId];
  if (!part || !part.dependsOn || part.dependsOn.length === 0) {
    return true;
  }
  
  return part.dependsOn.every(depId => 
    parts[depId] && parts[depId].completed
  );
};

/**
 * Get the next available part ID
 * @param {string} currentPartId - Current part ID
 * @param {Object} parts - The parts object from state
 * @returns {string|null} - Next available part ID or null if none
 */
export const getNextAvailablePart = (currentPartId, parts) => {
  const partIds = Object.keys(parts).sort();
  const currentIndex = partIds.indexOf(currentPartId);
  
  for (let i = currentIndex + 1; i < partIds.length; i++) {
    const partId = partIds[i];
    if (canAccessPart(partId, parts)) {
      return partId;
    }
  }
  
  return null;
};

/**
 * Update part locks based on dependencies
 * @param {Object} parts - The parts object from state
 * @returns {Object} - Updated parts object with correct lock states
 */
export const updatePartLocks = (parts) => {
  const updatedParts = { ...parts };
  
  Object.keys(updatedParts).forEach(partId => {
    updatedParts[partId] = {
      ...updatedParts[partId],
      locked: !canAccessPart(partId, parts)
    };
  });
  
  return updatedParts;
};

/**
 * Get the status indicator for a part
 * @param {Object} part - The part object
 * @param {string} currentPartId - Currently selected part ID
 * @returns {Object} - Status object with icon and color
 */
export const getPartStatus = (part, currentPartId) => {
  if (part.completed) {
    return { icon: '✓', color: '#28a745', label: 'completed' };
  }
  
  if (part.id === currentPartId) {
    return { icon: '→', color: '#007bff', label: 'current' };
  }
  
  if (part.locked) {
    return { icon: '🔒', color: '#6c757d', label: 'locked' };
  }
  
  return { icon: '○', color: '#6c757d', label: 'available' };
};

/**
 * Validate if all required parts are completed
 * @param {Object} parts - The parts object from state
 * @returns {boolean} - Whether assignment is fully completed
 */
export const isAssignmentComplete = (parts) => {
  return Object.values(parts).every(part => part.completed);
};

/**
 * Get the completion stats for the assignment
 * @param {Object} parts - The parts object from state
 * @returns {Object} - Completion statistics
 */
export const getCompletionStats = (parts) => {
  const partsList = Object.values(parts);
  const completed = partsList.filter(part => part.completed).length;
  const total = partsList.length;
  const remaining = total - completed;
  
  return {
    completed,
    total,
    remaining,
    percentage: calculateProgress(parts)
  };
}; 