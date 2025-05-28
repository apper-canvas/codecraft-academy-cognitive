import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPlayer from '../components/VideoPlayer'
import ApperIcon from '../components/ApperIcon'
import RatingSystem from '../components/RatingSystem'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentModule, setCurrentModule] = useState(0)
  const [progress, setProgress] = useState({})
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Helper function to get course ratings
  const getCourseRating = () => {
    const reviews = localStorage.getItem(`reviews_${id}`)
    if (!reviews) return { average: 0, count: 0 }
    
    const parsedReviews = JSON.parse(reviews)
    if (parsedReviews.length === 0) return { average: 0, count: 0 }
    
    const total = parsedReviews.reduce((sum, review) => sum + review.rating, 0)
    return { average: (total / parsedReviews.length), count: parsedReviews.length }
  }

  // Mock course data - in real app this would come from API
  const courseData = {
    1: {
      title: "JavaScript Fundamentals",
      description: "Master the basics of JavaScript programming with hands-on exercises and real-world projects.",
      instructor: "Sarah Johnson",
      difficulty: "Beginner",
      duration: "6 weeks",
      modules: [
        {
          id: 1,
          title: "Introduction to JavaScript",
          description: "Learn what JavaScript is and why it's important for web development",
          videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
          duration: "15:30",
          completed: false
        },
        {
          id: 2,
          title: "Variables and Data Types",
          description: "Understanding how to store and work with different types of data",
          videoUrl: "https://www.youtube.com/watch?v=9Y8u9Kj7E-g",
          duration: "22:45",
          completed: false
        },
        {
          id: 3,
          title: "Functions and Scope",
          description: "Creating reusable code blocks and understanding variable scope",
          videoUrl: "https://www.youtube.com/watch?v=N8ap4k_1QEQ",
          duration: "28:15",
          completed: false
        },
        {
          id: 4,
          title: "DOM Manipulation",
          description: "Learn to interact with HTML elements using JavaScript",
          videoUrl: "https://www.youtube.com/watch?v=0ik6X4DJKCc",
          duration: "35:20",
          completed: false
        }
      ]
    },
    2: {
      title: "Python for Data Science",
      description: "Learn Python programming with focus on data analysis and visualization.",
      instructor: "Dr. Mike Chen",
      difficulty: "Intermediate",
      duration: "8 weeks",
      modules: [
        {
          id: 1,
          title: "Python Basics for Data Science",
          description: "Essential Python concepts for data analysis",
          videoUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
          duration: "18:45",
          completed: false
        },
        {
          id: 2,
          title: "Working with Pandas",
          description: "Data manipulation and analysis with Pandas library",
          videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
          duration: "32:10",
          completed: false
        }
      ]
    },
    3: {
      title: "React Development Mastery",
      description: "Build modern web applications with React and its ecosystem.",
      instructor: "Alex Rodriguez",
      difficulty: "Advanced",
      duration: "10 weeks",
      modules: [
        {
          id: 1,
          title: "React Fundamentals",
          description: "Understanding components, props, and state",
          videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
          duration: "25:30",
          completed: false
        },
        {
          id: 2,
          title: "Hooks and State Management",
          description: "Modern React patterns with hooks",
          videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q",
          duration: "28:45",
          completed: false
        }
      ]
    }
  }

  const course = courseData[id]


  if (!course) return null

  const handleModuleComplete = (moduleId) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: { completed: true }
    }))
    
    // Auto-advance to next module if available
    if (currentModule < course.modules.length - 1) {
      setTimeout(() => {
        setCurrentModule(prev => prev + 1)
      }, 2000)
  }

    }

  const handleEnroll = () => {
    setIsEnrolled(true)
    toast.success(`Successfully enrolled in ${course.title}!`)
  }

  const currentModuleData = course.modules[currentModule]
  const completedModules = Object.keys(progress).filter(id => progress[id].completed).length
  const progressPercentage = (completedModules / course.modules.length) * 100

  const courseRating = getCourseRating()

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-purple-50 to-cyan-50 dark:from-surface-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center space-x-2 text-surface-600 dark:text-surface-300 hover:text-primary mb-4 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="h-5 w-5" />
            <span>Back to Courses</span>
          </button>

          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                  {course.title}
                </h1>
                <p className="text-surface-600 dark:text-surface-300 mb-3">
                  {course.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400 mb-3">
                  <span>Instructor: {course.instructor}</span>
                  <span>•</span>
                  <span>{course.difficulty}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>
                
                {/* Course Rating Display */}
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <ApperIcon 
                      key={star}
                      name="Star" 
                      className={`h-5 w-5 ${
                        star <= Math.round(courseRating.average) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-surface-300 dark:text-surface-600'
                      }`} 
                    />
                  ))}
                  <span className="text-surface-600 dark:text-surface-300 font-medium">
                    {courseRating.average > 0 
                      ? `${courseRating.average.toFixed(1)} (${courseRating.count} reviews)` 
                      : 'No ratings yet'
                    }
                  </span>
                </div>
              </div>
              
              {!isEnrolled ? (
                <motion.button
                  onClick={handleEnroll}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enroll Now
                </motion.button>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-surface-600 dark:text-surface-300 mb-2">
                    Progress: {completedModules}/{course.modules.length} modules
                  </div>
                  <div className="w-32 bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {isEnrolled ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Module Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 sticky top-8">
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
                  Course Modules
                </h3>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <motion.button
                      key={module.id}
                      onClick={() => setCurrentModule(index)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                        currentModule === index
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'bg-surface-50 dark:bg-surface-700 hover:bg-surface-100 dark:hover:bg-surface-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            progress[module.id]?.completed
                              ? 'bg-green-500 text-white'
                              : currentModule === index
                              ? 'bg-white/20 text-white'
                              : 'bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300'
                          }`}>
                            {progress[module.id]?.completed ? (
                              <ApperIcon name="Check" className="h-4 w-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{module.title}</div>
                            <div className={`text-xs ${
                              currentModule === index ? 'text-white/80' : 'text-surface-500 dark:text-surface-400'
                            }`}>
                              {module.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-surface-200 dark:border-surface-600">
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                    {currentModuleData.title}
                  </h2>
                  <p className="text-surface-600 dark:text-surface-300">
                    {currentModuleData.description}
                  </p>
                </div>

                <VideoPlayer
                  videoUrl={currentModuleData.videoUrl}
                  title={currentModuleData.title}
                  onEnded={() => handleModuleComplete(currentModuleData.id)}
                  className="aspect-video"
                />
              </div>
            </motion.div>
          </div>
          
            {/* Rating System */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <RatingSystem courseId={id} courseName={course.title} />
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Lock" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-surface-600 dark:text-surface-300 mb-2">
              Enroll to Access Course Content
            </h3>
            <p className="text-surface-500 dark:text-surface-400">
              Get instant access to all video lectures and course materials
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail