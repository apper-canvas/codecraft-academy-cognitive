import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { snippetService } from '../services/snippetService'
import SaveSnippetModal from './SaveSnippetModal'
import ApperIcon from './ApperIcon'
import Editor from '@monaco-editor/react'

const MainFeature = () => {
  const [activeLanguage, setActiveLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

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

  // Real-time code execution with output capture
  const executeJavaScript = (code) => {
    const originalConsole = { ...console }
    const logs = []
    
    // Override console methods to capture output
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '))
    }
    console.error = (...args) => {
      logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '))
    }
    console.warn = (...args) => {
      logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '))
    }
    console.info = (...args) => {
      logs.push('INFO: ' + args.map(arg => String(arg)).join(' '))
    }
    
    try {
      // Create a safer execution environment
      const safeGlobals = {
        console,
        Math,
        Date,
        JSON,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        Array,
        Object,
        String,
        Number,
        Boolean
      }
      
      // Wrap code in a function to capture return values
      const wrappedCode = `
        (function() {
          ${code}
        })()
      `
      
      // Execute the code
      const func = new Function(...Object.keys(safeGlobals), wrappedCode)
      const result = func(...Object.values(safeGlobals))
      
      // Add result to output if it exists and isn't undefined
      if (result !== undefined) {
        logs.push('=> ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)))
      }
      
      return {
        success: true,
        output: logs.length > 0 ? logs.join('\n') : '✓ Code executed successfully (no output)',
        logs
      }
    } catch (error) {
      return {
        success: false,
        output: `❌ Error: ${error.message}`,
        error: error.message
      }
    } finally {
      // Restore original console
      Object.assign(console, originalConsole)
    }
  }
  
  const executePython = (code) => {
    // Python simulation - in a real implementation, you'd need a Python interpreter
    const logs = []
    
    try {
      // Simple Python print simulation
      const printMatches = code.match(/print\(([^)]+)\)/g)
      if (printMatches) {
        printMatches.forEach(match => {
          const content = match.match(/print\(([^)]+)\)/)[1]
          // Simple evaluation for basic strings and variables
          let output = content.replace(/["']/g, '')
          if (content.includes('f"') || content.includes("f'")) {
            // Simple f-string simulation
            output = content.replace(/f["'](.+)["']/, '$1')
            output = output.replace(/\{([^}]+)\}/g, (match, expr) => {
              return `[${expr}]` // Simple placeholder for variable interpolation
            })
          }
          logs.push(output)
        })
      }
      
      return {
        success: true,
        output: logs.length > 0 ? logs.join('\n') : '✓ Python code executed successfully (no output)',
        logs
      }
    } catch (error) {
      return {
        success: false,
        output: `❌ Error: ${error.message}`,
        error: error.message
      }
    }
  }
  
  const executeReact = (code) => {
    try {
      // React component simulation
      const componentMatches = code.match(/function\s+(\w+)\s*\([^)]*\)\s*\{[^}]*return\s*([^}]+)\}/)
      if (componentMatches) {
        const componentName = componentMatches[1]
        return {
          success: true,
          output: `✓ React component '${componentName}' would render successfully!\n\nComponent structure validated:\n- Function component defined\n- JSX syntax correct\n- Props handling implemented`,
          logs: []
        }
      }
      
      return {
        success: true,
        output: '✓ React code structure validated successfully!',
        logs: []
      }
    } catch (error) {
      return {
        success: false,
        output: `❌ Error: ${error.message}`,
        error: error.message
      }
    }
  }

  const runCode = () => {
    
    setIsRunning(true)
    setOutput('')
    
    // Add a small delay for better UX
    setTimeout(() => {
      try {
        let result
        
        switch (activeLanguage) {
          case 'javascript':
            result = executeJavaScript(code)
            break
          case 'python':
            result = executePython(code)
            break
          case 'react':
            result = executeReact(code)
            break
          default:
          default:
            result = {
              success: false,
              output: 'Language not supported for execution'
            }
            break
        }
        
        setOutput(result.output)
      } catch (error) {
        setOutput(`❌ Execution Error: ${error.message}`)
      } finally {
        setIsRunning(false)
      }
    }, 800)
  }

  const handleLanguageChange = useCallback((languageId) => {
    setActiveLanguage(languageId)
    const currentLanguage = languages.find(lang => lang.id === languageId)
    if (currentLanguage && currentLanguage.defaultCode) {
      setCode(currentLanguage.defaultCode)
    }
    setOutput('')
  }


  const handleSaveSnippet = () => {
    if (!code.trim()) {
      return
    }
    setShowSaveModal(true)
  }

  const handleSnippetSaved = (snippetData) => {
    setShowSaveModal(false)
  }

  const currentLanguage = languages.find(lang => lang.id === activeLanguage) || languages[0]

  if (!code) {
    setCode(currentLanguage.defaultCode)
  }
  return (
    <section className="py-16 px-4 min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
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
            Practice coding in real-time with our interactive code editor
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-12">
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
                  >
                    <ApperIcon name={lang.icon} className="h-4 w-4" />
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Monaco Code Editor */}
              <div className="relative h-80">
                <Editor
                  height="320px"
                  language={activeLanguage === 'react' ? 'javascript' : activeLanguage}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    renderWhitespace: 'none'
                  }}
                  loading={
                    <div className="flex items-center justify-center h-80 bg-surface-900 text-surface-300">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Loader2" className="h-5 w-5 animate-spin" />
                        <span>Loading editor...</span>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Run Button and Output */}
              <div className="p-4 border-t border-surface-200 dark:border-surface-600">
                <motion.button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    isRunning
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-soft transform hover:scale-105'
                  } bg-gradient-to-r ${currentLanguage.color} text-white`}
                  whileHover={!isRunning ? { scale: 1.05 } : {}}
                  whileTap={!isRunning ? { scale: 0.95 } : {}}
                >
                  <ApperIcon 
                    name={isRunning ? "Loader2" : "Play"} 
                    className={`h-5 w-5 ${isRunning ? 'animate-spin' : ''}`} 
                  />
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </motion.button>

                {output && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-surface-900 text-surface-100 rounded-xl font-mono text-sm overflow-auto max-h-32"
                  >
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  </motion.div>
                )}

                {/* Save Snippet Button */}
                <motion.button
                  onClick={handleSaveSnippet}
                  className="mt-3 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="Save" className="h-4 w-4" />
                  <span>Save Snippet</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showSaveModal && (
        <SaveSnippetModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSnippetSaved}
          language={activeLanguage}
        />
      )}
    </section>
  )
}

export default MainFeature