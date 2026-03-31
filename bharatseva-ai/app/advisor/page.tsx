'use client'

import { motion } from 'framer-motion'
import SchemeAdvisor from '../../components/SchemeAdvisor'

export default function SchemeAdvisorPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Government Scheme Advisor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ask me about any government scheme in simple Hindi or English. I'll provide complete details including
            eligibility, benefits, required documents, and step-by-step application guidance.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
            <p className="text-gray-600 text-sm">
              AI understands your needs and finds the perfect schemes
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Details</h3>
            <p className="text-gray-600 text-sm">
              Eligibility, benefits, documents, and application steps
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗣️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple Language</h3>
            <p className="text-gray-600 text-sm">
              Explains complex schemes in easy-to-understand terms
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Based</h3>
            <p className="text-gray-600 text-sm">
              Shows schemes available in your district and state
            </p>
          </div>
        </motion.div>

        {/* Scheme Advisor Component */}
        <SchemeAdvisor />
      </div>
    </div>
  )
}