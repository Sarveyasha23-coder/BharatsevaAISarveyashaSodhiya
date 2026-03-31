'use client'

import { motion } from 'framer-motion'
import VoiceAssistant from '@/components/VoiceAssistant'

export default function VoicePage() {
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
            Multilingual Voice Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of government services with our AI-powered voice assistant.
            Get instant help in your preferred language through natural voice conversations.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎤</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Recognition</h3>
            <p className="text-gray-600 text-sm">
              Advanced speech recognition that understands multiple Indian languages
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">�</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced TTS</h3>
            <p className="text-gray-600 text-sm">
              High-quality text-to-speech using state-of-the-art AI models for natural voice synthesis
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">10+ Languages</h3>
            <p className="text-gray-600 text-sm">
              Support for Hindi, English, Bengali, Telugu, Tamil, and 6 other Indian languages
            </p>
          </div>
        </motion.div>

        {/* Voice Assistant Component */}
        <VoiceAssistant />
      </div>
    </div>
  )
}