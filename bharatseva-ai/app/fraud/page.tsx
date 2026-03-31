'use client'

import { motion } from 'framer-motion'
import FraudShieldAI from '@/components/FraudShieldAI'

export default function FraudPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fraud Shield AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered fraud detection system. Analyze suspicious messages, calls, and URLs
            to protect yourself from scams, phishing, and cyber threats.
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
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Analysis</h3>
            <p className="text-gray-600 text-sm">
              Scan SMS, emails, and messages for scam patterns and red flags
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📞</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Screening</h3>
            <p className="text-gray-600 text-sm">
              Analyze suspicious phone calls and verify caller authenticity
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">URL Scanner</h3>
            <p className="text-gray-600 text-sm">
              Check links and URLs for phishing and malicious content
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report & Alert</h3>
            <p className="text-gray-600 text-sm">
              Direct reporting to cybercrime authorities and safety alerts
            </p>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">2.2L</div>
            <p className="text-gray-600">Cybercrime cases reported in 2023</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">₹1,200Cr</div>
            <p className="text-gray-600">Financial losses due to cyber fraud</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">1930</div>
            <p className="text-gray-600">Cyber Crime Helpline Number</p>
          </div>
        </motion.div>

        {/* Fraud Shield AI Component */}
        <FraudShieldAI />
      </div>
    </div>
  )
}