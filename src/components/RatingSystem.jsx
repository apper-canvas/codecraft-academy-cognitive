import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

const RatingSystem = ({ courseId, courseName, showSubmissionForm = true, compact = false }) => {
  const [userRating, setUserRating] = useState(0)
  const [userReview, setUserReview] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)
  const reviewsPerPage = 5

  // Load reviews from localStorage on component mount
  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews_${courseId}`)
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews)
      setReviews(parsedReviews)
      
      // Check if user has already reviewed
      const userReview = parsedReviews.find(review => review.userId === 'current_user')
      if (userReview) {
        setHasUserReviewed(true)
        setUserRating(userReview.rating)
        setUserReview(userReview.comment)
      }
    }
  }, [courseId])

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`reviews_${courseId}`, JSON.stringify(reviews))
    }
  }, [reviews, courseId])

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1
    })
    return distribution
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    
    if (userRating === 0) {
      return
    }

    
    if (userReview.trim().length < 10) {
      return
    }


    const newReview = {
      id: Date.now(),
      userId: 'current_user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
      rating: userRating,
      comment: userReview.trim(),
      date: new Date().toISOString(),
      helpful: 0,
      verified: true
    }

    if (hasUserReviewed) {
      // Update existing review
      setReviews(prev => prev.map(review => 
        review.userId === 'current_user' 
          ? { ...newReview, id: review.id, helpful: review.helpful }
          : review
      ))
    } else {
      // Add new review
      setReviews(prev => [newReview, ...prev])
    }
    
    setShowReviewForm(false)
  }

  const handleDeleteReview = () => {
    setReviews(prev => prev.filter(review => review.userId !== 'current_user'))
    setHasUserReviewed(false)
    setUserRating(0)
    setUserReview('')
    setShowReviewForm(false)
  }

  const handleHelpfulClick = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  const filteredAndSortedReviews = () => {
    let filtered = reviews
    
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating))
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date)
        case 'oldest':
          return new Date(a.date) - new Date(b.date)
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        case 'helpful':
          return b.helpful - a.helpful
        default:
          return 0
      }
    })
  }

  const paginatedReviews = () => {
    const filtered = filteredAndSortedReviews()
    const startIndex = (currentPage - 1) * reviewsPerPage
    return filtered.slice(startIndex, startIndex + reviewsPerPage)
  }

  const totalPages = Math.ceil(filteredAndSortedReviews().length / reviewsPerPage)
  const averageRating = calculateAverageRating()
  const distribution = getRatingDistribution()

  const StarRating = ({ rating, interactive = false, size = 'md', onRatingChange, onHover, onLeave }) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && onHover && onHover(star)}
            onMouseLeave={() => interactive && onLeave && onLeave()}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200`}
          >
            <ApperIcon 
              name="Star" 
              className={`${sizeClasses[size]} ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-surface-300 dark:text-surface-600'
              }`} 
            />
          </button>
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <StarRating rating={Math.round(averageRating)} size="sm" />
        <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
          {averageRating} ({reviews.length} reviews)
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
        <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Course Ratings & Reviews
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-2">
              {averageRating}
            </div>
            <StarRating rating={Math.round(averageRating)} size="lg" />
            <p className="text-surface-600 dark:text-surface-300 mt-2">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-surface-600 dark:text-surface-300 w-8">
                  {rating}★
                </span>
                <div className="flex-1 bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: reviews.length > 0 
                        ? `${(distribution[rating] / reviews.length) * 100}%` 
                        : '0%'
                    }}
                  />
                </div>
                <span className="text-sm text-surface-600 dark:text-surface-300 w-8">
                  {distribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Review Form */}
      {showSubmissionForm && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              {hasUserReviewed ? 'Your Review' : 'Write a Review'}
            </h4>
            {hasUserReviewed && !showReviewForm && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {(!hasUserReviewed || showReviewForm) ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Your Rating
                </label>
                <StarRating 
                  rating={hoverRating || userRating}
                  interactive={true}
                  size="lg"
                  onRatingChange={setUserRating}
                  onHover={setHoverRating}
                  onLeave={() => setHoverRating(0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                  className="w-full p-3 border border-surface-200 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                  required
                />
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  Minimum 10 characters ({userReview.length}/10)
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  {hasUserReviewed ? 'Update Review' : 'Submit Review'}
                </button>
                {showReviewForm && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false)
                      setUserRating(reviews.find(r => r.userId === 'current_user')?.rating || 0)
                      setUserReview(reviews.find(r => r.userId === 'current_user')?.comment || '')
                    }}
                    className="px-6 py-2 bg-surface-200 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-xl font-medium hover:bg-surface-300 dark:hover:bg-surface-500 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <StarRating rating={userRating} size="md" />
              <p className="text-surface-700 dark:text-surface-300">{userReview}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Reviewed on {new Date(reviews.find(r => r.userId === 'current_user')?.date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Student Reviews
            </h4>
            
            <div className="flex space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
              
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-1 text-sm border border-surface-200 dark:border-surface-600 rounded-lg bg-surface-50 dark:bg-surface-700 text-surface-900 dark:text-surface-100"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {paginatedReviews().map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-surface-200 dark:border-surface-600 pb-4 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-surface-900 dark:text-surface-100">
                        {review.userName}
                      </span>
                      {review.verified && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-surface-500 dark:text-surface-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-surface-700 dark:text-surface-300 mb-2">
                      {review.comment}
                    </p>
                    <button
                      onClick={() => handleHelpfulClick(review.id)}
                      className="text-sm text-surface-500 dark:text-surface-400 hover:text-primary transition-colors"
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-surface-100 dark:bg-surface-600 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RatingSystem