import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { snippetService } from '../services/snippetService'
import SaveSnippetModal from './SaveSnippetModal'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeLanguage, setActiveLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [score, setScore] = useState(0)

  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: 'Zap',
      color: 'from-yellow-400 to-orange-500',
      defaultCode: `// Welcome to JavaScript!\nconsole.log("Hello, CodeCraft Academy!");\n\n// Try writing your own code below\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`
    },
    {
      id: 'python',
      name: 'Python',
      icon: 'BarChart3',
      color: 'from-green-400 to-blue-500',
      defaultCode: `# Welcome to Python!\nprint("Hello, CodeCraft Academy!")\n\n# Try writing your own code below\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`
    },
    {
      id: 'react',
      name: 'React',
      icon: 'Atom',
      color: 'from-blue-400 to-purple-500',
      defaultCode: `// Welcome to React!\nimport React from 'react';\n\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n// This would render: Hello, CodeCraft Academy!\n<Welcome name="CodeCraft Academy" />`
    }
  ]

  const quizQuestions = [
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
      question: "What does the '===' operator do in JavaScript?",
      options: ["Assignment", "Loose equality", "Strict equality", "Comparison"],
      correct: 2
    }
  ]

  const handleLanguageChange = (langId) => {
    const language = languages.find(lang => lang.id === langId)
    setActiveLanguage(langId)
    setCode(language.defaultCode)
    setOutput('')
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Mock output based on language
        let mockOutput = ''
        if (activeLanguage === 'javascript') {
          if (code.includes('console.log')) {
            mockOutput = 'Hello, CodeCraft Academy!\nHello, World!\n✓ Code executed successfully!'
          } else {
            mockOutput = '✓ Code executed successfully!'
          }
        } else if (activeLanguage === 'python') {
          if (code.includes('print')) {
            mockOutput = 'Hello, CodeCraft Academy!\nHello, World!\n✓ Code executed successfully!'
          } else {
            mockOutput = '✓ Code executed successfully!'
          }
        } else {
          mockOutput = '✓ React component would render successfully!'
        }
        
        setOutput(mockOutput)
        toast.success("Code executed successfully!")
      } catch (error) {
        setOutput('❌ Error: ' + error.message)
        toast.error("Code execution failed!")
      } finally {
        setIsRunning(false)
      }
    }, 1500)
  }

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === quizQuestions[currentQuiz].correct
    
    if (isCorrect) {
      setScore(score + 1)
      toast.success("Correct answer!")
    } else {
      toast.error("Incorrect answer. Try again!")
    }

    setTimeout(() => {
      if (currentQuiz < quizQuestions.length - 1) {
        setCurrentQuiz(currentQuiz + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuiz(0)
    setSelectedAnswer(null)
    setShowResults(false)
    setScore(0)
  }

  const currentLanguage = languages.find(lang => lang.id === activeLanguage)


  const handleSaveSnippet = useCallback(() => {
    if (!code.trim()) {
      toast.error('Please write some code before saving!')
      return
    }
    setShowSaveModal(true)
  }, [code])

  const handleSnippetSaved = (snippetData) => {
    const snippet = {
      ...snippetData,
      code,
      language: activeLanguage,
      createdAt: new Date().toISOString()
    }
    
    try {
      snippetService.createSnippet(snippet)
      toast.success('Snippet saved successfully!')
      setShowSaveModal(false)
    } catch (error) {
      toast.error('Failed to save snippet')
    }
  }
  if (!code) {
    setCode(currentLanguage.defaultCode)
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            Interactive Learning Experience
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            Practice coding in real-time and test your knowledge with interactive quizzes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Code Editor Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
              {/* Language Selector */}
              <div className="flex flex-wrap gap-2 p-4 bg-surface-50 dark:bg-surface-700 border-b border-surface-200 dark:border-surface-600">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeLanguage === lang.id
                        ? `bg-gradient-to-r ${lang.color} text-white shadow-card`
                        : 'bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-500'
                    }`}
              </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setCode(currentLanguage.defaultCode)
                      toast.info("Code reset to default")
                    }}
                    className="p-2 bg-surface-700 hover:bg-surface-600 text-surface-300 rounded-lg transition-colors"
                    title="Reset Code"
                  >
                    <ApperIcon name="RotateCcw" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSaveSnippet}
                    className="p-2 bg-surface-700 hover:bg-surface-600 text-surface-300 rounded-lg transition-colors"
                    title="Save Snippet"
                  >
                    <ApperIcon name="Bookmark" className="h-4 w-4" />
                  </button>
                </div>
                    title="Reset Code"
                  >
                    <ApperIcon name="RotateCcw" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Run Button and Output */}
              <div className="p-4 border-t border-surface-200 dark:border-surface-600">
                <motion.button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    isRunning
                      ? 'bg-surface-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${currentLanguage.color} hover:shadow-soft`
                  } text-white`}
                  whileHover={!isRunning ? { scale: 1.02 } : {}}
                  whileTap={!isRunning ? { scale: 0.98 } : {}}
                >
                  {isRunning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader" className="h-5 w-5" />
                      </motion.div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Play" className="h-5 w-5" />
                      <span>Run Code</span>
                    </>
                  )}
                </motion.button>

                {output && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-surface-900 text-green-400 rounded-lg font-mono text-sm whitespace-pre-wrap"
                  >
                    {output}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quiz Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  Quick Quiz
                </h3>
                <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-300">
                  <ApperIcon name="Target" className="h-4 w-4" />
                  <span>Score: {score}/{quizQuestions.length}</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key={currentQuiz}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                        Question {currentQuiz + 1} of {quizQuestions.length}
                      </span>
                      <div className="w-24 bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuiz + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                      <h4 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-4">
                        {quizQuestions[currentQuiz].question}
                      </h4>

                      <div className="space-y-3">
                        {quizQuestions[currentQuiz].options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleQuizAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                              selectedAnswer === null
                                ? 'bg-white dark:bg-surface-600 hover:bg-surface-100 dark:hover:bg-surface-500 border border-surface-200 dark:border-surface-500'
                                : selectedAnswer === index
                                ? index === quizQuestions[currentQuiz].correct
                                  ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : index === quizQuestions[currentQuiz].correct
                                ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-surface-200 dark:bg-surface-600 text-surface-500'
                            }`}
                            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-xs font-bold">
                                {String.fromCharCode(65 + index)}
                              </span>
                      <motion.button
                        onClick={resetQuiz}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Take Quiz Again
                      </motion.button>

        {showSaveModal && (
          <SaveSnippetModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSnippetSaved}
            language={activeLanguage}
          />
        )}
                      </h4>
                      <p className="text-lg text-surface-600 dark:text-surface-300">
                        You scored {score} out of {quizQuestions.length}
                      </p>
                      <div className="mt-4">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {Math.round((score / quizQuestions.length) * 100)}%
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Take Quiz Again

        {showSaveModal && (
          <SaveSnippetModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSnippetSaved}
            language={activeLanguage}
          />
        )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MainFeature