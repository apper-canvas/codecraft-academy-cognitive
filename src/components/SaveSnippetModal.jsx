import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'

const SaveSnippetModal = ({ isOpen, onClose, onSave, snippet = null, language = 'javascript' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: language,
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: 'Zap' },
    { id: 'python', name: 'Python', icon: 'BarChart3' },
    { id: 'react', name: 'React', icon: 'Atom' },
    { id: 'html', name: 'HTML', icon: 'FileText' },
    { id: 'css', name: 'CSS', icon: 'Palette' },
    { id: 'java', name: 'Java', icon: 'Coffee' },
    { id: 'cpp', name: 'C++', icon: 'Code2' },
    { id: 'typescript', name: 'TypeScript', icon: 'FileCode' },
    { id: 'php', name: 'PHP', icon: 'Server' },
    { id: 'go', name: 'Go', icon: 'Zap' },
    { id: 'rust', name: 'Rust', icon: 'Wrench' },
    { id: 'swift', name: 'Swift', icon: 'Smartphone' }
  ]

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title || '',
        description: snippet.description || '',
        code: snippet.code || '',
        language: snippet.language || language,
        tags: snippet.tags || []
      })
    } else {
      setFormData({
        title: '',
        description: '',
        code: '',
        language: language,
        tags: []
      })
    }
    setErrors({})
    setTagInput('')
  }, [snippet, language, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required'
    }

    if (!formData.language) {
      newErrors.language = 'Language is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const snippetData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim(),
        tags: formData.tags.filter(tag => tag.trim().length > 0)
      }
      
      await onSave(snippetData)
      onClose()
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const getLanguageIcon = (langId) => {
    const lang = languages.find(l => l.id === langId)
    return lang?.icon || 'Code'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              {snippet ? 'Edit Snippet' : 'Save New Snippet'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full p-3 border rounded-xl transition-all focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.title
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700'
                  }`}
                  placeholder="Enter a descriptive title for your snippet"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 rounded-xl transition-all focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Optional description of what this snippet does"
                  disabled={isSubmitting}
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Programming Language *
                </label>
                <div className="relative">
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className={`w-full p-3 border rounded-xl transition-all focus:ring-2 focus:ring-primary focus:border-transparent appearance-none ${
                      errors.language
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ApperIcon name={getLanguageIcon(formData.language)} className="h-5 w-5 text-surface-400" />
                  </div>
                </div>
                {errors.language && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.language}</p>
                )}
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Code *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    rows={12}
                    className={`w-full p-4 font-mono text-sm border rounded-xl transition-all focus:ring-2 focus:ring-primary focus:border-transparent resize-none code-editor ${
                      errors.code
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-surface-200 dark:border-surface-600 bg-surface-900 text-green-400'
                    }`}
                    placeholder="Paste your code here..."
                    spellCheck={false}
                    disabled={isSubmitting}
                  />
                  <div className="absolute top-2 right-2">
                    <ApperIcon name="Code" className="h-5 w-5 text-surface-400" />
                  </div>
                </div>
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      className="flex-1 p-3 border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700 rounded-xl transition-all focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Add a tag (e.g., loops, functions, api)"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || isSubmitting}
                      className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="Plus" className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-primary hover:text-primary-dark transition-colors"
                            disabled={isSubmitting}
                          >
                            <ApperIcon name="X" className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-soft transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader" className="h-5 w-5" />
                    </motion.div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name={snippet ? 'Save' : 'Plus'} className="h-5 w-5" />
                    <span>{snippet ? 'Update Snippet' : 'Save Snippet'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SaveSnippetModal