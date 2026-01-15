/// <reference path="../types/speech.d.ts" />
import { useState, useEffect, useRef } from 'react'

interface SpeechRecognitionResult {
  transcript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!isSupported) return

    // Initialize Speech Recognition
    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition

    recognitionRef.current = new SpeechRecognitionAPI()
    const recognition = recognitionRef.current

    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    // Event handlers
    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      
      if (event.error === 'no-speech') {
        setError('No speech detected')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied')
      } else {
        setError('Speech recognition failed')
      }
      
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [isSupported])

  const startListening = () => {
    if (!recognitionRef.current) return
    
    setTranscript('')
    setError(null)
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Failed to start recognition:', error)
      setError('Failed to start listening')
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    
    try {
      recognitionRef.current.stop()
    } catch (error) {
      console.error('Failed to stop recognition:', error)
    }
  }

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  }
}
