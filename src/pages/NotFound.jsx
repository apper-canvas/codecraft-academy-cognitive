import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="AlertTriangle" className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-surface-900 dark:text-surface-100 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
              Page Not Found
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-soft transition-all duration-300"
            >
              <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound