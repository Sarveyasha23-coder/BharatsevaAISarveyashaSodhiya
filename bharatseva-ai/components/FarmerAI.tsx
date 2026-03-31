'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, MapPin, Cloud, Droplets, Thermometer, Volume2, VolumeX } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  data?: any
}

interface WeatherData {
  temperature: string
  humidity: string
  rainfall: string
  forecast: string
}

interface MarketPrice {
  [key: string]: string
}

export default function FarmerAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'नमस्ते! मैं आपका कृषि सहायक कisan मित्र हूँ। आपकी फसल, मौसम, या कृषि संबंधित कोई भी सवाल पूछ सकते हैं।\n\nHello! I am your agricultural assistant Kisan Mitra. You can ask me any questions about crops, weather, or farming.',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [location, setLocation] = useState('')
  const [crop, setCrop] = useState('')
  const [season, setSeason] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [marketPrices, setMarketPrices] = useState<MarketPrice | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'hi-IN' // Hindi

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Load initial farmer data
  useEffect(() => {
    const loadFarmerData = async () => {
      try {
        const response = await fetch('/api/farmer')
        const data = await response.json()
        setWeatherData(data.weatherStations[0]) // Default to Delhi
        setMarketPrices(data.marketPrices)
      } catch (error) {
        console.error('Failed to load farmer data:', error)
      }
    }
    loadFarmerData()
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/farmer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          location,
          crop,
          season
        })
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        data: data.data
      }

      setMessages(prev => [...prev, aiMessage])

      // Update weather and market data if provided
      if (data.data) {
        if (data.data.weather) setWeatherData(data.data.weather)
        if (data.data.marketPrices) setMarketPrices(data.data.marketPrices)
      }

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'क्षमा करें, कुछ तकनीकी समस्या हुई है। कृपया पुनः प्रयास करें।\n\nSorry, there was a technical issue. Please try again.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
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
          utterance.lang = 'hi-IN' // Default to Hindi for farmer AI
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
        utterance.lang = 'hi-IN'
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">किसान मित्र (Kisan Mitra)</h2>
                  <p className="text-gray-600">Your AI Agricultural Assistant</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {!message.isUser && (
                          <button
                            onClick={() => speakText(message.text)}
                            disabled={isSpeaking}
                            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                            title="Listen to this message"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="अपनी कृषि संबंधित जिज्ञासा यहाँ लिखें... (Ask your farming question here...)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isLoading}
                />

                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 rounded-xl transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar with Context and Data */}
        <div className="space-y-6">
          {/* Location & Crop Context */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin size={20} className="mr-2 text-green-600" />
              Context Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (स्थान)
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Location</option>
                  <option value="punjab">Punjab (पंजाब)</option>
                  <option value="haryana">Haryana (हरियाणा)</option>
                  <option value="up">Uttar Pradesh (उत्तर प्रदेश)</option>
                  <option value="maharashtra">Maharashtra (महाराष्ट्र)</option>
                  <option value="karnataka">Karnataka (कर्नाटक)</option>
                  <option value="tamil-nadu">Tamil Nadu (तमिलनाडु)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Crop (वर्तमान फसल)
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Crop</option>
                  <option value="wheat">गेहूं (Wheat)</option>
                  <option value="rice">धान (Rice)</option>
                  <option value="cotton">कपास (Cotton)</option>
                  <option value="sugarcane">गन्ना (Sugarcane)</option>
                  <option value="maize">मक्का (Maize)</option>
                  <option value="pulses">दालें (Pulses)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season (मौसम)
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Season</option>
                  <option value="kharif">खरीफ (Kharif - June-Oct)</option>
                  <option value="rabi">रबी (Rabi - Nov-April)</option>
                  <option value="zaid">जायद (Zaid - March-June)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Weather Information */}
          {weatherData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Cloud size={20} className="mr-2 text-blue-600" />
                Weather Info (मौसम)
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer size={16} className="mr-2 text-red-500" />
                    <span className="text-sm text-gray-600">Temperature</span>
                  </div>
                  <span className="font-semibold">{weatherData.temperature}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets size={16} className="mr-2 text-blue-500" />
                    <span className="text-sm text-gray-600">Humidity</span>
                  </div>
                  <span className="font-semibold">{weatherData.humidity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cloud size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Rainfall</span>
                  </div>
                  <span className="font-semibold">{weatherData.rainfall}</span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{weatherData.forecast}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Market Prices */}
          {marketPrices && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Market Prices (बाजार भाव)
              </h3>

              <div className="space-y-3">
                {Object.entries(marketPrices).map(([crop, price]) => (
                  <div key={crop} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{crop}</span>
                    <span className="font-semibold text-green-600">₹{price}/quintal</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                * Prices are indicative and may vary by location
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}