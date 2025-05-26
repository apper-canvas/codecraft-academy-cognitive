import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'
import SaveSnippetModal from '../components/SaveSnippetModal'
import { snippetService } from '../services/snippetService'

const SnippetLibrary = () => {
  const [snippets, setSnippets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState(null)
  const [selectedSnippet, setSelectedSnippet] = useState(null)
  const [loading, setLoading] = useState(true)

  const languages = [
    { id: 'all', name: 'All Languages', icon: 'Code' },
    { id: 'javascript', name: 'JavaScript', icon: 'Zap' },
    { id: 'python', name: 'Python', icon: 'BarChart3' },
    { id: 'react', name: 'React', icon: 'Atom' },
    { id: 'html', name: 'HTML', icon: 'FileText' },
    { id: 'css', name: 'CSS', icon: 'Palette' },
    { id: 'java', name: 'Java', icon: 'Coffee' },
    { id: 'cpp', name: 'C++', icon: 'Code2' }
  ]

  const sortOptions = [
    { id: 'newest', name: 'Newest First', icon: 'Calendar' },
    { id: 'oldest', name: 'Oldest First', icon: 'CalendarDays' },
    { id: 'name', name: 'Name A-Z', icon: 'ArrowUpAZ' },
    { id: 'language', name: 'Language', icon: 'Code' },
    { id: 'bookmarked', name: 'Bookmarked', icon: 'Bookmark' }
  ]

  useEffect(() => {
    loadSnippets()
  }, [])

  const loadSnippets = async () => {
    try {
      setLoading(true)
      const data = await snippetService.getAllSnippets()
      setSnippets(data)
    } catch (error) {
      console.error('Failed to load snippets:', error)
    } finally {
      setLoading(false)
    }
  }


  const filteredAndSortedSnippets = useMemo(() => {
    let filtered = snippets

    // Search filter
    if (searchTerm) {
      const results = snippetService.searchSnippets(searchTerm)
      filtered = filtered.filter(snippet => 
        results.some(result => result.id === snippet.id)
      )
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage)
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(snippet => 
        selectedTags.some(tag => snippet.tags?.includes(tag))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'name':
          return a.title.localeCompare(b.title)
        case 'language':
          return a.language.localeCompare(b.language)
        case 'bookmarked':
          return (b.bookmarked ? 1 : 0) - (a.bookmarked ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [snippets, searchTerm, selectedLanguage, selectedTags, sortBy])

  const allTags = useMemo(() => {
    const tags = new Set()
    snippets.forEach(snippet => {
      snippet.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [snippets])

  const handleCreateSnippet = (snippetData) => {
    try {
      const newSnippet = snippetService.createSnippet({
        ...snippetData,
        createdAt: new Date().toISOString()
      })
      setSnippets(prev => [newSnippet, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create snippet:', error)
    }
  }


  const handleEditSnippet = (snippetData) => {
    try {
      const updatedSnippet = snippetService.updateSnippet(editingSnippet.id, {
        ...snippetData,
        updatedAt: new Date().toISOString()
      })
      setSnippets(prev => prev.map(s => s.id === editingSnippet.id ? updatedSnippet : s))
      setEditingSnippet(null)
    } catch (error) {
      console.error('Failed to update snippet:', error)
    }
  }


  const handleDeleteSnippet = (snippetId) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        snippetService.deleteSnippet(snippetId)
        setSnippets(prev => prev.filter(s => s.id !== snippetId))
        setSelectedSnippet(null)
      } catch (error) {
        console.error('Failed to delete snippet:', error)
      }
    }
  }


  const handleToggleBookmark = (snippetId) => {
    try {
      const snippet = snippets.find(s => s.id === snippetId)
      const updatedSnippet = snippetService.updateSnippet(snippetId, {
        bookmarked: !snippet.bookmarked,
        updatedAt: new Date().toISOString()
      })
      setSnippets(prev => prev.map(s => s.id === snippetId ? updatedSnippet : s))
    } catch (error) {
      console.error('Failed to update bookmark:', error)
    }
  }

  const handleCopySnippet = (code) => {
    navigator.clipboard.writeText(code)
  }


  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const getLanguageIcon = (language) => {
    const lang = languages.find(l => l.id === language)
    return lang?.icon || 'Code'
  }

  const getLanguageName = (language) => {
    const lang = languages.find(l => l.id === language)
    return lang?.name || language
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-purple-50 to-cyan-50 dark:from-surface-900 dark:via-purple-900/20 dark:to-cyan-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border-b border-surface-200/50 dark:border-surface-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-surface-600 dark:text-surface-300 hover:text-primary transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-surface-300 dark:bg-surface-600" />
              <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                Code Snippet Library
              </h1>
            </div>
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-soft transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name="Plus" className="h-5 w-5" />
              <span className="hidden sm:inline">New Snippet</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Search & Filter
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search snippets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    View Mode
                  </label>
                  <div className="flex rounded-xl bg-surface-100 dark:bg-surface-700 p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-surface-600 shadow-sm text-primary'
                          : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                      }`}
                    >
                      <ApperIcon name="Grid3X3" className="h-4 w-4" />
                      <span className="text-sm">Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-surface-600 shadow-sm text-primary'
                          : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                      }`}
                    >
                      <ApperIcon name="List" className="h-4 w-4" />
                      <span className="text-sm">List</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-white'
                          : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="mt-3 text-sm text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                  >
                    Clear all tags
                  </button>
                )}
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                Library Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Total Snippets</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">{snippets.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Bookmarked</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">
                    {snippets.filter(s => s.bookmarked).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-600 dark:text-surface-400">Languages</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-100">
                    {new Set(snippets.map(s => s.language)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </div>
            ) : filteredAndSortedSnippets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="Code" className="h-12 w-12 text-surface-400" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {snippets.length === 0 ? 'No snippets yet' : 'No snippets found'}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  {snippets.length === 0 
                    ? 'Start building your code snippet library by creating your first snippet.'
                    : 'Try adjusting your search criteria or filters.'
                  }
                </p>
                {snippets.length === 0 && (
                  <motion.button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-soft transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Your First Snippet
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <div className={viewMode === 'grid' ? 'snippet-grid' : 'space-y-4'}>
                <AnimatePresence>
                  {filteredAndSortedSnippets.map((snippet, index) => (
                    <motion.div
                      key={snippet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white dark:bg-surface-800 rounded-2xl shadow-card snippet-card overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {viewMode === 'grid' ? (
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <ApperIcon 
                                  name={getLanguageIcon(snippet.language)} 
                                  className="h-4 w-4 text-primary" 
                                />
                                <span className="text-sm text-surface-500 dark:text-surface-400">
                                  {getLanguageName(snippet.language)}
                                </span>
                                {snippet.bookmarked && (
                                  <ApperIcon name="Bookmark" className="h-4 w-4 text-accent" />
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2 line-clamp-2">
                                {snippet.title}
                              </h3>
                              {snippet.description && (
                                <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2 mb-3">
                                  {snippet.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleToggleBookmark(snippet.id)}
                                className="p-2 text-surface-400 hover:text-accent transition-colors"
                                title={snippet.bookmarked ? 'Remove bookmark' : 'Bookmark snippet'}
                              >
                                <ApperIcon 
                                  name={snippet.bookmarked ? 'Bookmark' : 'BookmarkPlus'} 
                                  className="h-5 w-5" 
                                />
                              </button>
                              <div className="relative group">
                                <button className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
                                  <ApperIcon name="MoreVertical" className="h-5 w-5" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-700 rounded-xl shadow-card border border-surface-200 dark:border-surface-600 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                  <button
                                    onClick={() => setSelectedSnippet(snippet)}
                                    className="w-full text-left px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-600 transition-colors flex items-center space-x-2"
                                  >
                                    <ApperIcon name="Eye" className="h-4 w-4" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    onClick={() => setEditingSnippet(snippet)}
                                    className="w-full text-left px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-600 transition-colors flex items-center space-x-2"
                                  >
                                    <ApperIcon name="Edit" className="h-4 w-4" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleCopySnippet(snippet.code)}
                                    className="w-full text-left px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-600 transition-colors flex items-center space-x-2"
                                  >
                                    <ApperIcon name="Copy" className="h-4 w-4" />
                                    <span>Copy</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSnippet(snippet.id)}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                                  >
                                    <ApperIcon name="Trash2" className="h-4 w-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-surface-900 rounded-xl p-4 mb-4">
                            <pre className="text-green-400 text-sm overflow-x-auto line-clamp-6 code-snippet">
                              <code>{snippet.code}</code>
                            </pre>
                          </div>

                          {snippet.tags && snippet.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {snippet.tags.map(tag => (
                                <span key={tag} className="snippet-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400">
                            <span>
                              Created {new Date(snippet.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleCopySnippet(snippet.code)}
                                className="flex items-center space-x-1 hover:text-primary transition-colors"
                              >
                                <ApperIcon name="Copy" className="h-4 w-4" />
                                <span>Copy</span>
                              </button>
                              <button
                                onClick={() => setSelectedSnippet(snippet)}
                                className="flex items-center space-x-1 hover:text-primary transition-colors"
                              >
                                <ApperIcon name="Eye" className="h-4 w-4" />
                                <span>View</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-6 space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                              <ApperIcon 
                                name={getLanguageIcon(snippet.language)} 
                                className="h-6 w-6 text-white" 
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 truncate">
                                {snippet.title}
                              </h3>
                              {snippet.bookmarked && (
                                <ApperIcon name="Bookmark" className="h-4 w-4 text-accent flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-surface-600 dark:text-surface-400 text-sm mb-2 line-clamp-1">
                              {snippet.description || 'No description'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
                              <span>{getLanguageName(snippet.language)}</span>
                              <span>•</span>
                              <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                              {snippet.tags && snippet.tags.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{snippet.tags.length} tags</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleBookmark(snippet.id)}
                              className="p-2 text-surface-400 hover:text-accent transition-colors"
                            >
                              <ApperIcon 
                                name={snippet.bookmarked ? 'Bookmark' : 'BookmarkPlus'} 
                                className="h-5 w-5" 
                              />
                            </button>
                            <button
                              onClick={() => handleCopySnippet(snippet.code)}
                              className="p-2 text-surface-400 hover:text-primary transition-colors"
                            >
                              <ApperIcon name="Copy" className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setSelectedSnippet(snippet)}
                              className="p-2 text-surface-400 hover:text-primary transition-colors"
                            >
                              <ApperIcon name="Eye" className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setEditingSnippet(snippet)}
                              className="p-2 text-surface-400 hover:text-primary transition-colors"
                            >
                              <ApperIcon name="Edit" className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSnippet(snippet.id)}
                              className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                            >
                              <ApperIcon name="Trash2" className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingSnippet) && (
        <SaveSnippetModal
          isOpen={showCreateModal || !!editingSnippet}
          onClose={() => {
            setShowCreateModal(false)
            setEditingSnippet(null)
          }}
          onSave={editingSnippet ? handleEditSnippet : handleCreateSnippet}
          snippet={editingSnippet}
          language={editingSnippet?.language}
        />
      )}

      {/* View Modal */}
      <AnimatePresence>
        {selectedSnippet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSnippet(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
                <div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                    {selectedSnippet.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <ApperIcon 
                      name={getLanguageIcon(selectedSnippet.language)} 
                      className="h-4 w-4 text-primary" 
                    />
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      {getLanguageName(selectedSnippet.language)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopySnippet(selectedSnippet.code)}
                    className="p-2 text-surface-400 hover:text-primary transition-colors"
                    title="Copy code"
                  >
                    <ApperIcon name="Copy" className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedSnippet(null)}
                    className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                  >
                    <ApperIcon name="X" className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {selectedSnippet.description && (
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    {selectedSnippet.description}
                  </p>
                )}
                
                <div className="bg-surface-900 rounded-xl p-6 mb-6">
                  <pre className="text-green-400 text-sm overflow-x-auto code-snippet">
                    <code>{selectedSnippet.code}</code>
                  </pre>
                </div>
                
                {selectedSnippet.tags && selectedSnippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedSnippet.tags.map(tag => (
                      <span key={tag} className="snippet-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400">
                  <span>
                    Created {new Date(selectedSnippet.createdAt).toLocaleDateString()}
                  </span>
                  {selectedSnippet.updatedAt && (
                    <span>
                      Updated {new Date(selectedSnippet.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SnippetLibrary