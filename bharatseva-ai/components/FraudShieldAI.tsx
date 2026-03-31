'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Phone, Link, Volume2, VolumeX } from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalysisResult {
  analysis: string
  riskAssessment: {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
    redFlags: string[]
    scamType: string
    recommendations: string[]
  }
  timestamp: string
}

export default function FraudShieldAI() {
  const [input, setInput] = useState('')
  const [messageType, setMessageType] = useState('message')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [recentScams, setRecentScams] = useState<any[]>([])

  // Load common scams on component mount
  useEffect(() => {
    const loadScams = async () => {
      try {
        const response = await fetch('/api/fraud')
        const data = await response.json()
        setRecentScams(data.commonScams.slice(0, 3)) // Show top 3
      } catch (error) {
        console.error('Failed to load scam data:', error)
      }
    }
    loadScams()
  }, [])

  const analyzeContent = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    setResult(null)

    try {
      const response = await fetch('/api/fraud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          messageType
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
      setResult({
        analysis: 'Analysis failed. Please try again.',
        riskAssessment: {
          riskLevel: 'Low',
          redFlags: [],
          scamType: 'Unknown',
          recommendations: ['Try again later']
        },
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low': return <CheckCircle size={20} />
      case 'Medium': return <AlertTriangle size={20} />
      case 'High':
      case 'Critical': return <XCircle size={20} />
      default: return <Shield size={20} />
    }
  }

  const speakText = async (text: string) => {
    if (!text.trim() || isSpeaking) return

    setIsSpeaking(true)

    try {
      // Try advanced TTS API first
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      })

      const contentType = response.headers.get('content-type')

      if (response.ok && contentType?.includes('audio')) {
        // Advanced TTS succeeded
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
          toast.error('Failed to play audio')
        }

        await audio.play()
      } else {
        // Fallback to browser TTS
        console.log('Using browser TTS fallback')
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = 'en-IN' // Default to English for fraud alerts
          utterance.rate = 0.9
          utterance.pitch = 1

          utterance.onend = () => {
            setIsSpeaking(false)
          }

          utterance.onerror = () => {
            setIsSpeaking(false)
            toast.error('Speech synthesis failed')
          }

          window.speechSynthesis.speak(utterance)
        } else {
          setIsSpeaking(false)
          toast.error('Text-to-speech not supported')
        }
      }
    } catch (error) {
      console.error('TTS error:', error)
      setIsSpeaking(false)

      // Final fallback to browser TTS
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-IN'
        utterance.rate = 0.9
        utterance.pitch = 1

        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
          toast.error('Speech synthesis failed')
        }

        window.speechSynthesis.speak(utterance)
      } else {
        toast.error('Text-to-speech not supported')
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Interface */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Fraud Shield AI
              </h2>
              <p className="text-gray-600">
                Analyze messages, calls, and URLs for potential scams and fraud
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="message"
                      checked={messageType === 'message'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="mr-2"
                    />
                    <Search size={16} className="mr-1" />
                    Message/SMS
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="call"
                      checked={messageType === 'call'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="mr-2"
                    />
                    <Phone size={16} className="mr-1" />
                    Phone Call
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="url"
                      checked={messageType === 'url'}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="mr-2"
                    />
                    <Link size={16} className="mr-1" />
                    URL/Link
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste the content to analyze
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    messageType === 'message'
                      ? "Paste the suspicious message or SMS here..."
                      : messageType === 'call'
                      ? "Describe the suspicious phone call..."
                      : "Paste the suspicious URL or link here..."
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={analyzeContent}
                disabled={!input.trim() || isAnalyzing}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze for Fraud'
                )}
              </button>
            </div>

            {/* Analysis Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-t border-gray-200 pt-6"
                >
                  <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskAssessment.riskLevel)}`}>
                      {getRiskIcon(result.riskAssessment.riskLevel)}
                      <span className="ml-2">Risk Level: {result.riskAssessment.riskLevel}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Analysis</h3>
                        <button
                          onClick={() => speakText(result.analysis)}
                          disabled={isSpeaking}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Listen to analysis"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{result.analysis}</p>
                    </div>

                    {result.riskAssessment.redFlags.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Red Flags Detected</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {result.riskAssessment.redFlags.map((flag, index) => (
                            <li key={index}>{flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.riskAssessment.recommendations.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Recommended Actions</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {result.riskAssessment.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar with Information */}
        <div className="space-y-6">
          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 rounded-xl shadow-lg border border-red-200 p-6"
          >
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              Report Fraud
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <div className="font-medium text-gray-900">Cyber Crime Helpline</div>
                <div className="text-red-600 font-bold">1930</div>
                <div className="text-xs text-gray-600">Delhi Police Cyber Cell</div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="font-medium text-gray-900">National Cyber Crime Portal</div>
                <div className="text-blue-600 font-bold">cybercrime.gov.in</div>
                <div className="text-xs text-gray-600">Online reporting</div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="font-medium text-gray-900">Banking Complaints</div>
                <div className="text-green-600 font-bold">14410</div>
                <div className="text-xs text-gray-600">RBI Complaint Number</div>
              </div>
            </div>
          </motion.div>

          {/* Common Scams */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Common Scams to Watch
            </h3>

            <div className="space-y-4">
              {recentScams.map((scam, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">{scam.type}</h4>
                  <p className="text-sm text-gray-600 mb-2">{scam.description}</p>
                  <div className="text-xs text-red-600 font-medium">
                    Red Flag: {scam.redFlags[0]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Prevention Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 rounded-xl shadow-lg border border-blue-200 p-6"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Prevention Tips
            </h3>

            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Never share OTP or banking details
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Verify sender identity independently
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Be suspicious of "too good to be true" offers
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Use official government portals only
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Report suspicious activities immediately
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}