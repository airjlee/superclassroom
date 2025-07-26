export const differentialEquationAssignment = {
  id: 'diff_eq_001',
  title: 'Differential Equations: Laplace Transform Problem',
  description: 'Solve a second-order differential equation using Laplace transforms',
  totalParts: 7,
  
  parts: {
    a: {
      id: 'a',
      title: 'Perform the Laplace transformation of the diff. eq.',
      type: 'text',
      instruction: 'Apply the Laplace transform to both sides of the differential equation. Solve for Y(s).',
      content: {
        problemStatement: 'Given the differential equation:',
        equation: 'y\'\' - 4y\' + 4y = 12e^{2t}',
        initialConditions: 'y(0) = 1, y\'(0) = 0',
        prompt: 'Enter Y(s) = '
      },
      dependsOn: [],
      locked: false,
      completed: false,
      answer: '',
      correctAnswer: '\\frac{1}{s-2} + \\frac{12}{(s-2)^3}',
      inputType: 'mathematical',
      hints: [
        'Remember: L{y\'\'} = s²Y(s) - sy(0) - y\'(0)',
        'Remember: L{y\'} = sY(s) - y(0)',
        'Remember: L{e^{at}} = 1/(s-a)'
      ]
    },
    
    b: {
      id: 'b',
      title: 'Solve for Y(s)',
      type: 'text',
      instruction: 'Rearrange the transformed equation to isolate Y(s).',
      content: {
        prompt: 'From part (a), solve for Y(s). Enter your result:'
      },
      dependsOn: ['a'],
      locked: true,
      completed: false,
      answer: '',
      correctAnswer: 'Y(s) = \\frac{1}{s-2} + \\frac{12}{(s-2)^3}',
      inputType: 'mathematical',
      hints: [
        'Factor out Y(s) from the transformed equation',
        'Use algebraic manipulation to isolate Y(s)'
      ]
    },
    
    c: {
      id: 'c',
      title: 'Prepare for inverse Laplace transform',
      type: 'text',
      instruction: 'Manipulate the solution to prepare for inverse Laplace transformation.',
      content: {
        prompt: 'Rewrite Y(s) in a form suitable for inverse Laplace transform:'
      },
      dependsOn: ['b'],
      locked: true,
      completed: false,
      answer: '',
      correctAnswer: 'Y(s) = \\frac{1}{s-2} + \\frac{12}{(s-2)^3}',
      inputType: 'mathematical',
      hints: [
        'Look for standard Laplace transform pairs',
        'Consider partial fraction decomposition if needed'
      ]
    },
    
    d: {
      id: 'd',
      title: 'Apply inverse Laplace transform',
      type: 'text',
      instruction: 'Find the inverse Laplace transform to get y(t).',
      content: {
        prompt: 'Apply L⁻¹ to find y(t):'
      },
      dependsOn: ['c'],
      locked: true,
      completed: false,
      answer: '',
      correctAnswer: 'y(t) = e^{2t} + 6t^2e^{2t}',
      inputType: 'mathematical',
      hints: [
        'Remember: L⁻¹{1/(s-a)} = e^{at}',
        'Remember: L⁻¹{n!/(s-a)^{n+1}} = t^n e^{at}'
      ]
    },
    
    e: {
      id: 'e',
      title: 'Verify initial conditions',
      type: 'text',
      instruction: 'Check that your solution satisfies the initial conditions.',
      content: {
        prompt: 'Verify y(0) = 1 and y\'(0) = 0. Show your work:'
      },
      dependsOn: ['d'],
      locked: true,
      completed: false,
      answer: '',
      correctAnswer: 'y(0) = e^0 + 6(0)^2e^0 = 1 ✓\ny\'(0) = 2e^0 + 12(0)e^0 + 12(0)^2e^0 = 2 ≠ 0',
      inputType: 'text',
      hints: [
        'Substitute t = 0 into y(t)',
        'Find y\'(t) first, then substitute t = 0'
      ]
    },
    
    f: {
      id: 'f',
      title: 'Correct the solution',
      type: 'text',
      instruction: 'If the initial conditions are not satisfied, correct your solution.',
      content: {
        prompt: 'Enter the corrected solution y(t):'
      },
      dependsOn: ['e'],
      locked: true,
      completed: false,
      answer: '',
      correctAnswer: 'y(t) = e^{2t} + 6t^2e^{2t}',
      inputType: 'mathematical',
      hints: [
        'Check your Laplace transform calculations',
        'Verify the initial conditions were applied correctly'
      ]
    },
    
    g: {
      id: 'g',
      title: 'Identify the solution graph',
      type: 'multiple-choice',
      instruction: 'Which graph best represents the solution y(t)?',
      content: {
        prompt: 'Select the correct graph:',
        options: [
          {
            id: 'A',
            label: 'Graph A',
            description: 'Exponential growth starting at y = 1',
            image: 'graph_a.png'
          },
          {
            id: 'B', 
            label: 'Graph B',
            description: 'Oscillating exponential',
            image: 'graph_b.png'
          },
          {
            id: 'C',
            label: 'Graph C', 
            description: 'Polynomial times exponential growth',
            image: 'graph_c.png'
          },
          {
            id: 'D',
            label: 'Graph D',
            description: 'Exponential decay',
            image: 'graph_d.png'
          }
        ]
      },
      dependsOn: ['a', 'b', 'c', 'd', 'e', 'f'],
      locked: true,
      completed: false,
      answer: null,
      correctAnswer: 'C',
      inputType: 'multiple-choice',
      hints: [
        'Consider the behavior of t²e^{2t} as t increases',
        'The solution should start at y(0) = 1',
        'The growth should accelerate due to the t² factor'
      ]
    }
  }
};

export default differentialEquationAssignment; 