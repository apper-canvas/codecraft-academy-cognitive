import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const Quiz = () => {
  const navigate = useNavigate()
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [currentLevel, setCurrentLevel] = useState('beginner')
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false)

  const quizLevels = {
    beginner: {
      name: 'Beginner',
      color: 'from-green-400 to-green-600',
      description: 'Basic programming concepts',
      questions: [
        {
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
          correct: 0
        },
        {
          question: "Which method is used to add an element to the end of an array?",
          options: ["append()", "add()", "push()", "insert()"],
          correct: 2
        },
        {
          question: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
          correct: 0
        },
        {
          question: "Which of these is a primitive data type in JavaScript?",
          options: ["Array", "Object", "String", "Function"],
          correct: 2
        },
        {
          question: "What symbol is used for single-line comments in JavaScript?",
          options: ["#", "//", "/*", "--"],
          correct: 1
        },
        {
          question: "Which operator is used to compare both value and type in JavaScript?",
          options: ["==", "===", "!=", "="],
          correct: 1
        },
        {
          question: "What is the correct way to write a for loop in JavaScript?",
          options: ["for i = 1 to 5", "for (i = 0; i <= 5; i++)", "for i in range(5)", "for (i <= 5; i++)"],
          correct: 1
        },
        {
          question: "Which CSS property is used to change the text color?",
          options: ["text-color", "font-color", "color", "text-style"],
          correct: 2
        },
        {
          question: "What does CSS stand for?",
          options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
          correct: 1
        },
        {
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correct: 1
        }
      ]
    },
    intermediate: {
      name: 'Intermediate',
      color: 'from-blue-400 to-indigo-600',
      description: 'Intermediate programming concepts',
      questions: [
        {
          question: "What does the '===' operator do in JavaScript?",
          options: ["Assignment", "Loose equality", "Strict equality", "Comparison"],
          correct: 2
        },
        {
          question: "Which of the following is a JavaScript framework?",
          options: ["Django", "React", "Laravel", "Flask"],
          correct: 1
        },
        {
          question: "What is the purpose of the 'this' keyword in JavaScript?",
          options: ["References the current function", "References the global object", "References the current object context", "References the parent object"],
          correct: 2
        },
        {
          question: "Which method is used to iterate over an array in JavaScript?",
          options: ["loop()", "forEach()", "iterate()", "cycle()"],
          correct: 1
        },
        {
          question: "What is the difference between 'let' and 'var' in JavaScript?",
          options: ["No difference", "let has block scope, var has function scope", "var has block scope, let has function scope", "let is faster than var"],
          correct: 1
        },
        {
          question: "Which method is used to convert a string to lowercase?",
          options: ["toLowerCase()", "toLower()", "lowerCase()", "lower()"],
          correct: 0
        },
        {
          question: "What does DOM stand for?",
          options: ["Document Object Model", "Data Object Management", "Dynamic Object Model", "Document Oriented Model"],
          correct: 0
        },
        {
          question: "Which event occurs when the user clicks on an HTML element?",
          options: ["onchange", "onclick", "onmouseclick", "onpress"],
          correct: 1
        },
        {
          question: "What is the purpose of JSON in web development?",
          options: ["Styling web pages", "Data interchange format", "Creating animations", "Database management"],
          correct: 1
        },
        {
          question: "Which HTTP method is used to retrieve data?",
          options: ["POST", "PUT", "GET", "DELETE"],
          correct: 2
        }
      ]
    },
    advanced: {
      name: 'Advanced',
      color: 'from-red-400 to-purple-600',
      description: 'Advanced programming concepts',
      questions: [
        {
          question: "What is a closure in JavaScript?",
          options: ["A function that returns another function", "A function that has access to variables in its outer scope", "A function that is immediately invoked", "A function that accepts other functions as parameters"],
          correct: 1
        },
        {
          question: "Which pattern is commonly used for state management in React?",
          options: ["Observer Pattern", "Singleton Pattern", "Flux/Redux Pattern", "Factory Pattern"],
          correct: 2
        },
        {
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correct: 1
        },
        {
          question: "What is the purpose of debouncing in JavaScript?",
          options: ["To speed up function execution", "To limit the rate of function execution", "To cache function results", "To handle asynchronous operations"],
          correct: 1
        },
        {
          question: "What is memoization in programming?",
          options: ["A debugging technique", "A caching technique to optimize expensive function calls", "A way to handle memory leaks", "A method to compress data"],
          correct: 1
        },
        {
          question: "Which design pattern ensures a class has only one instance?",
          options: ["Factory Pattern", "Observer Pattern", "Singleton Pattern", "Strategy Pattern"],
          correct: 2
        },
        {
          question: "What is the Virtual DOM in React?",
          options: ["A copy of the real DOM kept in memory", "A faster version of the DOM", "A debugging tool", "A testing framework"],
          correct: 0
        },
        {
          question: "What is the purpose of code splitting in web applications?",
          options: ["To organize code better", "To reduce initial bundle size and improve performance", "To enable testing", "To prevent bugs"],
          correct: 1
        },
        {
          question: "Which testing approach focuses on testing individual units of code?",
          options: ["Integration testing", "End-to-end testing", "Unit testing", "Performance testing"],
          correct: 2
        },
        {
          question: "What is the space complexity of merge sort?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 2
        }
      ]
    }
  }

  const handleLevelSelect = (level) => {
    setCurrentLevel(level)
    setCurrentQuiz(0)
    setSelectedAnswer(null)
    setShowResults(false)
    setScore(0)
    setHasStartedQuiz(true)
    toast.info(`Starting ${quizLevels[level].name} level quiz!`)
  }

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const currentQuestions = quizLevels[currentLevel].questions
    const isCorrect = answerIndex === currentQuestions[currentQuiz].correct
    
    if (isCorrect) {
      setScore(score + 1)
      toast.success("Correct answer!")
    } else {
      toast.error("Incorrect answer. Try again!")
    }

    setTimeout(() => {
      if (currentQuiz < currentQuestions.length - 1) {
        setCurrentQuiz(currentQuiz + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
        const finalScore = score + (isCorrect ? 1 : 0)
        const percentage = Math.round((finalScore / currentQuestions.length) * 100)
        if (percentage >= 80) {
          toast.success(`Excellent! You completed ${quizLevels[currentLevel].name} level!`)
        } else if (percentage >= 60) {
          toast.info(`Good job! You passed ${quizLevels[currentLevel].name} level!`)
        } else {
          toast.warning(`Keep practicing! Try ${quizLevels[currentLevel].name} level again.`)
        }
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setSelectedAnswer(null)
    setShowResults(false)
    setScore(0)
    setHasStartedQuiz(false)
    toast.info("Quiz reset. Select a level to start again!")
  }

  const nextLevel = () => {
    const levels = Object.keys(quizLevels)
    const currentIndex = levels.indexOf(currentLevel)
    if (currentIndex < levels.length - 1) {
      const nextLevelKey = levels[currentIndex + 1]
      setCurrentLevel(nextLevelKey)
      setCurrentQuiz(0)
      setSelectedAnswer(null)
      setShowResults(false)
      setScore(0)
      setHasStartedQuiz(true)
      toast.success(`Advancing to ${quizLevels[nextLevelKey].name} level!`)
    }
  }

  const currentQuestions = quizLevels[currentLevel].questions

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-purple-50 to-cyan-50 dark:from-surface-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Code2" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CodeCraft Academy
              </h1>
            </motion.div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors font-medium"
              >
                Courses
              </button>
              <button
                onClick={() => navigate('/snippets')}
                className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors font-medium"
              >
                Snippets
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
              Interactive Programming Quiz
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Test your programming knowledge with interactive quizzes across different difficulty levels
            </p>
          </motion.div>

          {/* Quiz Section */}
          <motion.div
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-6 border-b border-surface-200 dark:border-surface-600">
              <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                Programming Knowledge Test
              </h3>
              <p className="text-surface-600 dark:text-surface-300">
                Challenge yourself with questions designed to test your understanding
              </p>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {!hasStartedQuiz ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
                        Choose Your Level
                      </h4>
                      <p className="text-surface-600 dark:text-surface-300">
                        Select a difficulty level to start the quiz
                      </p>
                    </div>
                    
                    <div className="grid gap-4">
                      {Object.entries(quizLevels).map(([levelKey, level]) => (
                        <motion.button
                          key={levelKey}
                          onClick={() => handleLevelSelect(levelKey)}
                          className={`p-4 rounded-xl border-2 border-surface-200 dark:border-surface-600 hover:border-primary transition-all duration-300 text-left group`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className={`font-semibold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                                {level.name}
                              </h5>
                              <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                                {level.description}
                              </p>
                              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                                {level.questions.length} questions
                              </p>
                            </div>
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${level.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : showResults ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="p-6 bg-surface-50 dark:bg-surface-700 rounded-xl">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${quizLevels[currentLevel].color} mb-4`}>
                        <ApperIcon name="Trophy" className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                        {quizLevels[currentLevel].name} Complete!
                      </h4>
                      <p className="text-lg text-surface-600 dark:text-surface-300">
                        You scored {score} out of {currentQuestions.length}
                      </p>
                      <div className={`text-3xl font-bold bg-gradient-to-r ${quizLevels[currentLevel].color} bg-clip-text text-transparent mt-2`}>
                        {Math.round((score / currentQuestions.length) * 100)}%
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <motion.button
                        onClick={resetQuiz}
                        className="px-6 py-3 bg-surface-600 hover:bg-surface-700 text-white font-medium rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Choose New Level
                      </motion.button>
                      
                      {currentLevel !== 'advanced' && score / currentQuestions.length >= 0.6 && (
                        <motion.button
                          onClick={nextLevel}
                          className={`px-6 py-3 bg-gradient-to-r ${quizLevels[Object.keys(quizLevels)[Object.keys(quizLevels).indexOf(currentLevel) + 1]]?.color || 'from-primary to-secondary'} text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Next Level
                        </motion.button>
                      )}
                      
                      <motion.button
                        onClick={() => {
                          setCurrentQuiz(0)
                          setSelectedAnswer(null)
                          setShowResults(false)
                          setScore(0)
                          setHasStartedQuiz(true)
                          toast.info(`Retrying ${quizLevels[currentLevel].name} level!`)
                        }}
                        className={`px-6 py-3 bg-gradient-to-r ${quizLevels[currentLevel].color} text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Retry Level
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuiz}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                        {quizLevels[currentLevel].name} - Question {currentQuiz + 1} of {currentQuestions.length}
                      </span>
                      <div className="flex space-x-1">
                        {currentQuestions.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentQuiz
                                ? 'bg-primary'
                                : index < currentQuiz
                                ? 'bg-green-500'
                                : 'bg-surface-300 dark:bg-surface-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        {currentQuestions[currentQuiz].question}
                      </h4>

                      <div className="space-y-3">
                        {currentQuestions[currentQuiz].options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                              selectedAnswer === null
                                ? 'border-surface-200 dark:border-surface-600 hover:border-primary hover:bg-surface-50 dark:hover:bg-surface-700'
                                : selectedAnswer === index
                                ? index === currentQuestions[currentQuiz].correct
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : index === currentQuestions[currentQuiz].correct
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-surface-200 dark:border-surface-600 opacity-50'
                            }`}
                            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer === null
                                  ? 'border-surface-300 dark:border-surface-500'
                                  : selectedAnswer === index
                                  ? index === currentQuestions[currentQuiz].correct
                                    ? 'border-green-500 bg-green-500'
                                    : 'border-red-500 bg-red-500'
                                  : index === currentQuestions[currentQuiz].correct
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-surface-300 dark:border-surface-500'
                              }`}>
                                {selectedAnswer !== null && (
                                  index === currentQuestions[currentQuiz].correct ? (
                                    <ApperIcon name="Check" className="h-3 w-3 text-white" />
                                  ) : selectedAnswer === index ? (
                                    <ApperIcon name="X" className="h-3 w-3 text-white" />
                                  ) : null
                                )}
                              </div>
                              <span className="text-sm">{option}</span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Quiz