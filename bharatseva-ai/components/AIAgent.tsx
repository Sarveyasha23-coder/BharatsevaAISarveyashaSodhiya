'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, TrendingUp, Clock, Shield, Zap, Target } from 'lucide-react'

interface Recommendation {
  title: string
  description: string
  service: string
  priority: 'high' | 'medium' | 'low'
}

export default function AIAgent() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    age: 35,
    income: 'Middle Class',
    occupation: 'Farmer',
    location: 'Bhopal, Madhya Pradesh',
    familySize: 4
  })

  const analyzeProfile = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setRecommendations([
        {
          title: 'PM Kisan Samman Nidhi',
          description: 'Monthly income support for farmers',
          service: 'Agriculture',
          priority: 'high'
        },
        {
          title: 'Ayushman Bharat',
          description: 'Health insurance coverage for family',
          service: 'Healthcare',
          priority: 'high'
        },
        {
          title: 'PM Awas Yojana',
          description: 'Housing subsidy for rural areas',
          service: 'Housing',
          priority: 'medium'
        },
        {
          title: 'Pradhan Mantri Jan Dhan Yojana',
          description: 'Banking services and insurance',
          service: 'Finance',
          priority: 'medium'
        }
      ])
      setIsAnalyzing(false)
    }, 3000)
  }

  useEffect(() => {
    analyzeProfile()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-orange-500'
      case 'medium': return 'from-yellow-500 to-green-500'
      case 'low': return 'from-blue-500 to-purple-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Bot className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Personal Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your intelligent government services companion that understands your needs and provides personalized recommendations
        </p>
      </div>

      {/* User Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-600" />
          Your Profile Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">👤</span>
              </div>
              <span className="font-semibold text-gray-900">Personal Info</span>
            </div>
            <p className="text-sm text-gray-600">Age: {userProfile.age}</p>
            <p className="text-sm text-gray-600">Occupation: {userProfile.occupation}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">💰</span>
              </div>
              <span className="font-semibold text-gray-900">Financial Status</span>
            </div>
            <p className="text-sm text-gray-600">Income: {userProfile.income}</p>
            <p className="text-sm text-gray-600">Family Size: {userProfile.familySize}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">📍</span>
              </div>
              <span className="font-semibold text-gray-900">Location</span>
            </div>
            <p className="text-sm text-gray-600">{userProfile.location}</p>
          </div>
        </div>
      </motion.div>

      {/* AI Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-500" />
            AI Recommendations
          </h2>
          <button
            onClick={analyzeProfile}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        {isAnalyzing ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">AI is analyzing your profile and local schemes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {rec.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getPriorityColor(rec.priority)} text-white rounded-full text-xs font-medium mb-2`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(rec.priority)}`}></div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {rec.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Service: {rec.service}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Learn More
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-green-500" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-3">
            <Shield className="w-5 h-5" />
            <span>Check Eligibility</span>
          </button>

          <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-3">
            <Bot className="w-5 h-5" />
            <span>Ask AI Assistant</span>
          </button>

          <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-3">
            <Target className="w-5 h-5" />
            <span>Find Local Services</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}