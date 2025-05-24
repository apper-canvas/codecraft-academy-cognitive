import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

// Helper function to get course ratings from localStorage
const getCourseRating = (courseId) => {
  const reviews = localStorage.getItem(`reviews_${courseId}`)
  if (!reviews) return { average: 0, count: 0 }
  
  const parsedReviews = JSON.parse(reviews)
  if (parsedReviews.length === 0) return { average: 0, count: 0 }
  
  const total = parsedReviews.reduce((sum, review) => sum + review.rating, 0)
  return {
    average: (total / parsedReviews.length),
    count: parsedReviews.length
  }
}

const Courses = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Master the basics of JavaScript programming with hands-on exercises and real-world projects.",
      language: "JavaScript",
      difficulty: "Beginner",
      modules: 12,
      duration: "6 weeks",
      students: 2400,
      instructor: "Sarah Johnson",
      price: 49.99,
      icon: "Zap",
      color: "from-yellow-400 to-orange-500",
      tags: ["Variables", "Functions", "DOM", "ES6"],
      thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400"
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Learn Python programming with focus on data analysis, visualization, and machine learning basics.",
      language: "Python",
      difficulty: "Intermediate",
      modules: 15,
      duration: "8 weeks",
      students: 1800,
      instructor: "Dr. Mike Chen",
      price: 79.99,
      icon: "BarChart3",
      color: "from-green-400 to-blue-500",
      tags: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
      thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400"
    },
    {
      id: 3,
      title: "React Development Mastery",
      description: "Build modern web applications with React, including hooks, context, and state management.",
      language: "React",
      difficulty: "Advanced",
      modules: 20,
      duration: "10 weeks",
      students: 3200,
      instructor: "Alex Rodriguez",
      price: 99.99,
      icon: "Atom",
      color: "from-blue-400 to-purple-500",
      tags: ["Hooks", "Context", "Redux", "Testing"],
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400"
    },
    {
      id: 4,
      title: "Node.js Backend Development",
      description: "Create scalable backend applications with Node.js, Express, and database integration.",
      language: "JavaScript",
      difficulty: "Intermediate",
      modules: 16,
      duration: "7 weeks",
      students: 1500,
      instructor: "Emma Wilson",
      price: 69.99,
      icon: "Server",
      color: "from-green-500 to-teal-500",
      tags: ["Express", "MongoDB", "APIs", "Authentication"],
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400"
    },
    {
      id: 5,
      title: "Machine Learning with Python",
      description: "Dive deep into machine learning algorithms and build intelligent applications.",
      language: "Python",
      difficulty: "Advanced",
      modules: 22,
      duration: "12 weeks",
      students: 980,
      instructor: "Dr. Lisa Park",
      price: 129.99,
      icon: "Brain",
      color: "from-purple-500 to-pink-500",
      tags: ["TensorFlow", "Neural Networks", "Deep Learning", "AI"],
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
      id: 6,
      title: "CSS & Design Systems",
      description: "Master modern CSS techniques and build consistent, scalable design systems.",
      language: "CSS",
      difficulty: "Beginner",
      modules: 10,
      duration: "5 weeks",
      students: 2100,
      instructor: "Tom Bradley",
      price: 39.99,
      icon: "Palette",
      color: "from-pink-400 to-red-500",
      tags: ["Grid", "Flexbox", "Animations", "Responsive"],
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400"
    }
  ]

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']
  const languages = ['all', 'JavaScript', 'Python', 'React', 'CSS']

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage
    
    return matchesSearch && matchesDifficulty && matchesLanguage
  })

  const handleEnrollCourse = (course) => {
    toast.success(`Successfully enrolled in ${course.title}!`)
    navigate(`/course/${course.id}`)
  }

  const handleViewCourse = (course) => {
    navigate(`/course/${course.id}`)
  }

  const StarRating = ({ rating, count, size = 'sm' }) => {
    const sizeClasses = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon 
            key={star}
            name="Star" 
            className={`${sizeClasses} ${
              star <= Math.round(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-surface-300 dark:text-surface-600'
            }`} 
          />
        ))}
        <span className="text-sm text-surface-600 dark:text-surface-300 ml-1">
          {rating > 0 ? rating.toFixed(1) : 'No ratings'} {count > 0 && `(${count})`}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-purple-50 to-cyan-50 dark:from-surface-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      {/* Header */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
              Programming Courses
            </h1>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Choose from our comprehensive collection of programming courses designed for every skill level
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>

              {/* Language Filter */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language === 'all' ? 'All Languages' : language}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
              <span className="text-surface-600 dark:text-surface-300">
                {filteredCourses.length} courses found
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                  }`}
                >
                  <ApperIcon name="List" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Courses Grid */}
          <AnimatePresence>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredCourses.map((course, index) => {
                const courseRating = getCourseRating(course.id);
                
                return (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group bg-white dark:bg-surface-800 rounded-2xl shadow-card hover:shadow-soft transition-all duration-300 overflow-hidden"
                  >
                  {/* Course Image/Header */}
                  <div className={`h-48 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <ApperIcon name={course.icon} className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm font-medium">
                            {courseRating.average > 0 ? courseRating.average.toFixed(1) : 'New'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                      <p className="text-white/80 text-sm">by {course.instructor}</p>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Rating Display */}
                    <div className="mb-3">
                      <StarRating rating={courseRating.average} count={courseRating.count} />
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {course.difficulty}
                      </span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ${course.price}
                      </span>
                    </div>

                    <p className="text-surface-600 dark:text-surface-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-surface-600 dark:text-surface-300 mb-4">
                      <span className="flex items-center">
                        <ApperIcon name="BookOpen" className="h-4 w-4 mr-1" />
                        {course.modules} modules
                      </span>
                      <span className="flex items-center">
                        <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <ApperIcon name="Users" className="h-4 w-4 mr-1" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex space-x-3">
                      <motion.button
                        onClick={() => handleViewCourse(course)}
                        className="flex-1 py-2 px-4 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        onClick={() => handleEnrollCourse(course)}
                        className="flex-1 py-2 px-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-soft transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Enroll Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          </AnimatePresence>

          {filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="Search" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-surface-600 dark:text-surface-300 mb-2">
                No courses found
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                Try adjusting your search criteria or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Courses