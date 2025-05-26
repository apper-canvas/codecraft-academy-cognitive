import Fuse from 'fuse.js'

class SnippetService {
  constructor() {
    this.storageKey = 'codecraft_snippets'
    this.snippets = this.loadSnippets()
    this.fuse = null
    this.initializeSearch()
  }

  loadSnippets() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load snippets:', error)
      return []
    }
  }

  saveSnippets() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.snippets))
      this.initializeSearch() // Reinitialize search after data changes
    } catch (error) {
      console.error('Failed to save snippets:', error)
      throw new Error('Failed to save snippet')
    }
  }

  initializeSearch() {
    const options = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'code', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    }
    this.fuse = new Fuse(this.snippets, options)
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  validateSnippet(snippet) {
    if (!snippet.title || snippet.title.trim().length === 0) {
      throw new Error('Snippet title is required')
    }
    if (!snippet.code || snippet.code.trim().length === 0) {
      throw new Error('Snippet code is required')
    }
    if (!snippet.language) {
      throw new Error('Programming language is required')
    }
  }

  createSnippet(snippetData) {
    this.validateSnippet(snippetData)
    
    const snippet = {
      id: this.generateId(),
      title: snippetData.title.trim(),
      description: snippetData.description?.trim() || '',
      code: snippetData.code.trim(),
      language: snippetData.language,
      tags: snippetData.tags?.filter(tag => tag.trim().length > 0) || [],
      bookmarked: false,
      createdAt: snippetData.createdAt || new Date().toISOString(),
      updatedAt: null
    }
    
    this.snippets.unshift(snippet)
    this.saveSnippets()
    return snippet
  }

  getAllSnippets() {
    return Promise.resolve([...this.snippets])
  }

  getSnippetById(id) {
    const snippet = this.snippets.find(s => s.id === id)
    if (!snippet) {
      throw new Error('Snippet not found')
    }
    return snippet
  }

  updateSnippet(id, updates) {
    const index = this.snippets.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Snippet not found')
    }

    const currentSnippet = this.snippets[index]
    const updatedSnippet = {
      ...currentSnippet,
      ...updates,
      id: currentSnippet.id, // Ensure ID cannot be changed
      createdAt: currentSnippet.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    }

    // Validate if core properties are being updated
    if (updates.title || updates.code || updates.language) {
      this.validateSnippet(updatedSnippet)
    }

    // Clean up tags
    if (updates.tags) {
      updatedSnippet.tags = updates.tags.filter(tag => tag.trim().length > 0)
    }

    this.snippets[index] = updatedSnippet
    this.saveSnippets()
    return updatedSnippet
  }

  deleteSnippet(id) {
    const index = this.snippets.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Snippet not found')
    }

    const deletedSnippet = this.snippets.splice(index, 1)[0]
    this.saveSnippets()
    return deletedSnippet
  }

  searchSnippets(query) {
    if (!query || query.trim().length === 0) {
      return this.snippets
    }

    const results = this.fuse.search(query.trim())
    return results.map(result => result.item)
  }

  getSnippetsByLanguage(language) {
    return this.snippets.filter(snippet => snippet.language === language)
  }

  getSnippetsByTag(tag) {
    return this.snippets.filter(snippet => 
      snippet.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    )
  }

  getBookmarkedSnippets() {
    return this.snippets.filter(snippet => snippet.bookmarked)
  }

  getAllTags() {
    const tags = new Set()
    this.snippets.forEach(snippet => {
      snippet.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }

  getAllLanguages() {
    const languages = new Set(this.snippets.map(snippet => snippet.language))
    return Array.from(languages).sort()
  }

  getStatistics() {
    const totalSnippets = this.snippets.length
    const bookmarkedCount = this.snippets.filter(s => s.bookmarked).length
    const languageCount = this.getAllLanguages().length
    const tagCount = this.getAllTags().length
    
    const languageDistribution = {}
    this.snippets.forEach(snippet => {
      languageDistribution[snippet.language] = (languageDistribution[snippet.language] || 0) + 1
    })

    return {
      totalSnippets,
      bookmarkedCount,
      languageCount,
      tagCount,
      languageDistribution
    }
  }

  exportSnippets() {
    const exportData = {
      snippets: this.snippets,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    return JSON.stringify(exportData, null, 2)
  }

  importSnippets(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      if (!data.snippets || !Array.isArray(data.snippets)) {
        throw new Error('Invalid import format')
      }

      // Validate each snippet
      data.snippets.forEach((snippet, index) => {
        try {
          this.validateSnippet(snippet)
        } catch (error) {
          throw new Error(`Invalid snippet at index ${index}: ${error.message}`)
        }
      })

      // Add unique IDs to imported snippets and avoid duplicates
      const existingTitles = new Set(this.snippets.map(s => s.title.toLowerCase()))
      const newSnippets = data.snippets
        .filter(snippet => !existingTitles.has(snippet.title.toLowerCase()))
        .map(snippet => ({
          ...snippet,
          id: this.generateId(),
          createdAt: snippet.createdAt || new Date().toISOString(),
          updatedAt: null
        }))

      this.snippets.unshift(...newSnippets)
      this.saveSnippets()
      return newSnippets.length
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`)
    }
  }

  clearAllSnippets() {
    this.snippets = []
    this.saveSnippets()
  }
}

// Create and export a singleton instance
export const snippetService = new SnippetService()
export default snippetService