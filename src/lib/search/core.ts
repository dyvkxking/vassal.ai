// Search Engine Core - In-memory full-text search with TF-IDF scoring

// Base document type - only requires id
export interface SearchDocument {
  id: string
}

// Search result wrapper
export interface SearchResult<T extends SearchDocument> {
  document: T
  score: number
  highlights?: Record<string, string[]>
}

export interface SearchFilters {
  [key: string]: string | number | boolean | string[] | undefined | { min?: number; max?: number }
}

export interface SearchOptions {
  page?: number
  pageSize?: number
  sort?: string
  sortOrder?: 'asc' | 'desc'
  filters?: SearchFilters
}

export interface SearchResponse<T extends SearchDocument> {
  results: SearchResult<T>[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets?: Record<string, unknown>
  searchTimeMs: number
}

export interface Token {
  term: string
  positions: number[]
  frequency: number
}

// Indexed document with tokenized content
interface IndexedDocument<T extends SearchDocument> {
  doc: T
  tokens: Map<string, Token>
  docLength: number
}

// Simple tokenizer: lowercase, strip punctuation, split on whitespace
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 0)
}

// Calculate term frequency for a document
export function calculateTermFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>()
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1)
  }
  return freq
}

// Calculate inverse document frequency
function calculateIDF(
  documents: IndexedDocument<SearchDocument>[],
  term: string
): number {
  const numDocsWithTerm = documents.filter((doc) => doc.tokens.has(term)).length
  if (numDocsWithTerm === 0) return 0
  return Math.log(documents.length / numDocsWithTerm)
}

// TF-IDF score calculation (internal)
function calculateTFIDF(
  termFreq: number,
  docLength: number,
  idf: number
): number {
  const tf = termFreq / docLength
  return tf * idf
}

export class SearchEngine<T extends SearchDocument> {
  private documents: Map<string, IndexedDocument<T>> = new Map()
  private idfCache: Map<string, number> = new Map()
  private avgDocLength: number = 0

  // Index a single document
  index(doc: T): void {
    const textFields = this.extractTextFields(doc)
    const allText = Object.values(textFields).join(' ')
    const tokens = tokenize(allText)
    const termFreq = calculateTermFrequency(tokens)
    const docLength = tokens.length

    const tokenMap = new Map<string, Token>()
    let position = 0
    for (const token of tokens) {
      const existing = tokenMap.get(token)
      if (existing) {
        existing.frequency++
        existing.positions.push(position)
      } else {
        tokenMap.set(token, {
          term: token,
          positions: [position],
          frequency: 1,
        })
      }
      position++
    }

    this.documents.set(doc.id, {
      doc,
      tokens: tokenMap,
      docLength,
    })
  }

  // Index multiple documents
  indexAll(docs: T[]): void {
    this.documents.clear()
    this.idfCache.clear()

    for (const doc of docs) {
      this.index(doc)
    }

    this.calculateIDFCache()
    this.avgDocLength = this.calculateAvgDocLength()
  }

  // Extract text fields from document for indexing
  protected extractTextFields(_doc: T): Record<string, string> {
    return {}
  }

  // Calculate IDF for all terms
  private calculateIDFCache(): void {
    const docs = Array.from(this.documents.values())
    const allTerms = new Set<string>()

    for (const doc of docs) {
      for (const token of doc.tokens.keys()) {
        allTerms.add(token)
      }
    }

    for (const term of allTerms) {
      this.idfCache.set(term, calculateIDF(docs, term))
    }
  }

  // Calculate average document length
  private calculateAvgDocLength(): number {
    if (this.documents.size === 0) return 0
    let total = 0
    for (const doc of this.documents.values()) {
      total += doc.docLength
    }
    return total / this.documents.size
  }

  // Search documents
  search(
    query: string,
    options: SearchOptions = {}
  ): SearchResponse<T> {
    const startTime = performance.now()

    const {
      page = 1,
      pageSize = 20,
      sort,
      sortOrder = 'desc',
      filters = {},
    } = options

    // Tokenize query
    const queryTokens = tokenize(query)
    if (queryTokens.length === 0) {
      return this.emptyResponse(page, pageSize, startTime)
    }

    // Get documents matching filters
    let candidateDocs = Array.from(this.documents.values())

    // Apply filters
    candidateDocs = this.applyFilters(candidateDocs, filters)

    // Calculate scores
    const scoredDocs = candidateDocs
      .map((indexedDoc) => ({
        doc: indexedDoc.doc,
        score: this.calculateScore(indexedDoc, queryTokens),
      }))
      .filter((item) => item.score > 0)

    // Sort results
    scoredDocs.sort((a, b) => {
      if (sort) {
        const aVal = (a.doc as Record<string, unknown>)[sort]
        const bVal = (b.doc as Record<string, unknown>)[sort]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
      }
      return sortOrder === 'asc' ? a.score - b.score : b.score - a.score
    })

    const total = scoredDocs.length
    const totalPages = Math.ceil(total / pageSize)
    const offset = (page - 1) * pageSize
    const paginatedResults = scoredDocs.slice(offset, offset + pageSize)

    const endTime = performance.now()

    return {
      results: paginatedResults.map((item) => ({
        document: item.doc,
        score: item.score,
      })),
      total,
      page,
      pageSize,
      totalPages,
      searchTimeMs: Math.round(endTime - startTime),
    }
  }

  // Calculate relevance score for a document
  private calculateScore(
    indexedDoc: IndexedDocument<T>,
    queryTokens: string[]
  ): number {
    let score = 0
    const docLength = indexedDoc.docLength || 1

    for (const queryToken of queryTokens) {
      const tokenData = indexedDoc.tokens.get(queryToken)
      if (tokenData) {
        const idf = this.idfCache.get(queryToken) || 0
        const tf = tokenData.frequency / docLength
        score += tf * idf * 100 // Scale up for readability
      }
    }

    return score
  }

  // Apply filters to documents
  private applyFilters(
    docs: IndexedDocument<T>[],
    filters: SearchFilters
  ): IndexedDocument<T>[] {
    return docs.filter((indexedDoc) => {
      const doc = indexedDoc.doc as Record<string, unknown>
      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined) continue

        const docValue = doc[key]

        if (Array.isArray(value)) {
          // IN filter
          if (!value.includes(docValue as string)) return false
        } else if (typeof value === 'object' && value !== null) {
          // Range filter { min, max }
          const range = value as { min?: number; max?: number }
          if (range.min !== undefined && typeof docValue === 'number') {
            if (docValue < range.min) return false
          }
          if (range.max !== undefined && typeof docValue === 'number') {
            if (docValue > range.max) return false
          }
        } else {
          // Exact match
          if (docValue !== value) return false
        }
      }
      return true
    })
  }

  // Empty response helper
  private emptyResponse(
    page: number,
    pageSize: number,
    startTime: number
  ): SearchResponse<T> {
    const endTime = performance.now()
    return {
      results: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      searchTimeMs: Math.round(endTime - startTime),
    }
  }

  // Get document count
  getDocumentCount(): number {
    return this.documents.size
  }

  // Clear index
  clear(): void {
    this.documents.clear()
    this.idfCache.clear()
  }
}
