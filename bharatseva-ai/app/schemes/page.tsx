'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, FileText, Users, Heart, Tractor, GraduationCap, Home } from 'lucide-react'
import toast from 'react-hot-toast'

interface Scheme {
  id: string
  name: string
  description: string
  category: string
  eligibility: string
  benefits: string[]
  applicationUrl?: string
}

const categories = [
  { name: 'All', icon: FileText, color: 'bg-gray-100 text-gray-800' },
  { name: 'Financial', icon: Users, color: 'bg-blue-100 text-blue-800' },
  { name: 'Health', icon: Heart, color: 'bg-red-100 text-red-800' },
  { name: 'Agriculture', icon: Tractor, color: 'bg-green-100 text-green-800' },
  { name: 'Education', icon: GraduationCap, color: 'bg-purple-100 text-purple-800' },
  { name: 'Housing', icon: Home, color: 'bg-yellow-100 text-yellow-800' }
]

export default function Schemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [])

  useEffect(() => {
    filterSchemes()
  }, [schemes, searchQuery, selectedCategory])

  const fetchSchemes = async () => {
    try {
      const response = await fetch('/api/schemes')
      const data = await response.json()
      setSchemes(data.schemes)
    } catch (error) {
      toast.error('Failed to load schemes')
    } finally {
      setLoading(false)
    }
  }

  const filterSchemes = () => {
    let filtered = schemes

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredSchemes(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Government Schemes</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore verified official scheme portals and find the right public program faster
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.name
                  ? 'bg-blue-600 text-white'
                  : category.color
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Schemes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSchemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  scheme.category === 'Financial' ? 'bg-blue-100' :
                  scheme.category === 'Health' ? 'bg-red-100' :
                  scheme.category === 'Agriculture' ? 'bg-green-100' :
                  scheme.category === 'Education' ? 'bg-purple-100' :
                  scheme.category === 'Housing' ? 'bg-yellow-100' :
                  'bg-gray-100'
                }`}>
                  {scheme.category === 'Financial' && <Users className="w-6 h-6 text-blue-600" />}
                  {scheme.category === 'Health' && <Heart className="w-6 h-6 text-red-600" />}
                  {scheme.category === 'Agriculture' && <Tractor className="w-6 h-6 text-green-600" />}
                  {scheme.category === 'Education' && <GraduationCap className="w-6 h-6 text-purple-600" />}
                  {scheme.category === 'Housing' && <Home className="w-6 h-6 text-yellow-600" />}
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {scheme.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{scheme.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility:</h4>
                <p className="text-sm text-gray-600">{scheme.eligibility}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {scheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {scheme.applicationUrl && (
                <a
                  href={scheme.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Open official portal
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

        {filteredSchemes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
