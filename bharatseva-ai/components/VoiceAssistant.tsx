"use client"

import { useState } from "react"

export default function VoiceAssistant() {

  const [text, setText] = useState("")
  const [response, setResponse] = useState("")

  const startListening = () => {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Browser not supported")
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = "en-IN"
    recognition.start()

    recognition.onresult = (event: any) => {
      const speechText = event.results[0][0].transcript
      setText(speechText)

      handleAIResponse(speechText)
    }
  }

  const speak = (message: string) => {

    const speech = new SpeechSynthesisUtterance(message)

    speech.lang = "en-IN"

    window.speechSynthesis.speak(speech)
  }

  const handleAIResponse = (input: string) => {

    let reply = ""

    if (input.toLowerCase().includes("pm kisan")) {
      reply = "PM Kisan Yojana provides six thousand rupees to farmers"
    }

    else if (input.toLowerCase().includes("health")) {
      reply = "You can visit nearest government hospital"
    }

    else if (input.toLowerCase().includes("farmer")) {
      reply = "Weather is good for wheat crop"
    }

    else {
      reply = "I am BharatSeva AI, how can I help you"
    }

    setResponse(reply)
    speak(reply)
  }

  return (
    <div className="bg-white p-6 rounded shadow">

      <button
        onClick={startListening}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        🎤 Tap and Speak
      </button>

      <div className="mt-6">

        <p className="text-lg">
          <strong>You said:</strong> {text}
        </p>

        <p className="text-lg mt-3">
          <strong>AI Response:</strong> {response}
        </p>

      </div>

    </div>
  )
}