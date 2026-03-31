'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Volume2, VolumeX } from 'lucide-react'
import toast from 'react-hot-toast'

interface OCRResult {
  ocrResults: {
    extractedText: string
    keyInformation: Record<string, string>
    formMapping: Record<string, string>
    validation: {
      isValid: boolean
      completeness: number
      issues: string[]
    }
  }
  analysis: string
  timestamp: string
}

export default function DocumentOCR() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [documentType, setDocumentType] = useState('')
  const [targetForm, setTargetForm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [supportedDocs, setSupportedDocs] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadSupportedDocs = async () => {
      try {
        const response = await fetch('/api/ocr')
        const data = await response.json()
        setSupportedDocs(data)
      } catch (error) {
        console.error('Failed to load supported documents:', error)
      }
    }
    loadSupportedDocs()
  }, [])

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = () => reject(new Error('Unable to read file'))
      reader.readAsDataURL(file)
    })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const processDocument = async () => {
    if (!selectedFile || !documentType) return

    setIsProcessing(true)
    setResult(null)

    try {
      const base64 = await readFileAsDataUrl(selectedFile)
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData: base64,
          documentType,
          targetForm
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Document processing failed')
      }

      setResult(data)
    } catch (error) {
      console.error('OCR processing failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process document')
      setResult({
        ocrResults: {
          extractedText: 'Processing failed',
          keyInformation: {},
          formMapping: {},
          validation: { isValid: false, completeness: 0, issues: ['Processing error'] }
        },
        analysis: 'Failed to process document. Please try again.',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadFormData = () => {
    if (!result) return

    const dataStr = JSON.stringify(result.ocrResults.formMapping, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = 'form-data.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
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
          utterance.lang = 'en-IN' // Default to English for document analysis
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
        {/* Main Processing Interface */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Document OCR AI
              </h2>
              <p className="text-gray-600">
                Extract information from documents and auto-fill government forms
              </p>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Document preview" className="max-h-48 mx-auto rounded-lg" />
                    <p className="text-sm text-gray-600">Click to change document</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload Document</p>
                      <p className="text-gray-600">Click to select or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">Supports: JPG, PNG, PDF</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Document Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Document Type</option>
                  {supportedDocs?.documents?.map((doc: any) => (
                    <option key={doc.type} value={doc.type}>{doc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Form (Optional)
                </label>
                <select
                  value={targetForm}
                  onChange={(e) => setTargetForm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Target Form</option>
                  {supportedDocs?.forms?.map((form: any, index: number) => (
                    <option key={index} value={form.name}>{form.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={processDocument}
              disabled={!selectedFile || !documentType || isProcessing}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing Document...
                </div>
              ) : (
                'Extract Information'
              )}
            </button>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 border-t border-gray-200 pt-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Processing Results</h3>
                    <button
                      onClick={downloadFormData}
                      className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      <Download size={14} className="mr-1" />
                      Download Data
                    </button>
                  </div>

                  {/* Validation Status */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      result.ocrResults.validation.isValid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.ocrResults.validation.isValid ? (
                        <CheckCircle size={16} className="mr-1" />
                      ) : (
                        <AlertTriangle size={16} className="mr-1" />
                      )}
                      {result.ocrResults.validation.isValid ? 'Valid Document' : 'Issues Found'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Completeness: {result.ocrResults.validation.completeness}%
                    </div>
                  </div>

                  {/* Extracted Information */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Information</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {Object.entries(result.ocrResults.keyInformation).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Issues */}
                    {result.ocrResults.validation.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Issues Found</h4>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <ul className="list-disc list-inside space-y-1 text-yellow-800">
                            {result.ocrResults.validation.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Analysis */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">Analysis</h4>
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
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{result.analysis}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar with Information */}
        <div className="space-y-6">
          {/* Supported Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supported Documents
            </h3>

            <div className="space-y-3">
              {supportedDocs?.documents?.map((doc: any) => (
                <div key={doc.type} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600">
                    Extracts: {doc.fields.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Auto-fill */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Auto-fill Forms
            </h3>

            <div className="space-y-3">
              {supportedDocs?.forms?.map((form: any, index: number) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{form.name}</h4>
                  <p className="text-sm text-blue-700">
                    Requires: {form.required_fields.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-green-50 rounded-xl shadow-lg border border-green-200 p-6"
          >
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              OCR Tips
            </h3>

            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ensure good lighting and clear image
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Hold camera steady and avoid blur
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Capture entire document in frame
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Supported formats: JPG, PNG, PDF
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
