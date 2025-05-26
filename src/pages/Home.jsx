import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      language: "JavaScript",
      difficulty: "Beginner",
      modules: 12,
      duration: "6 weeks",
      icon: "Zap",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Python for Data Science",
      language: "Python",
      difficulty: "Intermediate",
      modules: 15,
      duration: "8 weeks",
      icon: "BarChart3",
      color: "from-green-400 to-blue-500"
    },
    {
      id: 3,
      title: "React Development",
      language: "React",
      difficulty: "Advanced",
      modules: 20,
      duration: "10 weeks",
      icon: "Atom",
      color: "from-blue-400 to-purple-500"
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
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
            
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate('/courses')}
                className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors font-medium"
              >
                Courses
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors font-medium"
              >
                Quiz
              </button>
              <button
                onClick={() => navigate('/snippets')}
                className="text-surface-600 dark:text-surface-300 hover:text-primary transition-colors font-medium"
              >
                Snippets
              </button>

            </div>
            
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white dark:bg-surface-800 shadow-card hover:shadow-soft transition-all duration-300 neu-button"
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="h-5 w-5 text-surface-600 dark:text-surface-300" 
              />
            </motion.button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-surface-900 dark:text-surface-100 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Master Programming Through
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Interactive Learning
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience hands-on coding with real-time feedback, interactive quizzes, and personalized learning paths designed for every skill level.
            </motion.p>
          </div>

          {/* Featured Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course.id}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-800 shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className={`h-32 bg-gradient-to-br ${course.color} relative`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <ApperIcon name={course.icon} className="h-8 w-8 mb-2" />
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {course.difficulty}
                    </span>
                    <span className="text-sm text-surface-500">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-surface-600 dark:text-surface-300">
                    <span>{course.modules} modules</span>
                    <span className="flex items-center">
                      <ApperIcon name="Users" className="h-4 w-4 mr-1" />
                      2.4k students
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Courses Button */}
          <div className="text-center mb-16">
            <motion.button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Courses
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Interactive Feature */}
      <MainFeature />

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Students", value: "50K+", icon: "Users" },
              { label: "Courses Available", value: "200+", icon: "BookOpen" },
              { label: "Code Challenges", value: "1K+", icon: "Target" },
              { label: "Success Rate", value: "94%", icon: "TrendingUp" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-surface-600 dark:text-surface-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home