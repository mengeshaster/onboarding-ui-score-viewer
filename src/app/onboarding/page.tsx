'use client'

import { useState } from 'react'
import { OnboardingForm } from '@/components/onboarding/onboarding-form'
import { ScoreDisplay } from '@/components/score/score-display'
import { ScoreHistory } from '@/components/score/score-history'

export default function OnboardingPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'form' | 'score' | 'history'>('form')

  const handleOnboardingComplete = (data: { sessionId: string; score: number; userId: string }) => {
    setSessionId(data.sessionId)
    setScore(data.score)
    setUserId(data.userId)
    setCurrentView('score')
  }

  const handleViewHistory = () => {
    setCurrentView('history')
  }

  const handleBackToScore = () => {
    setCurrentView('score')
  }

  const handleStartOver = () => {
    // Clear localStorage when starting over
    if (typeof window !== 'undefined') {
      localStorage.removeItem('onboarding-form-data')
      localStorage.removeItem('onboarding-current-step')
    }
    
    setCurrentView('form')
    setSessionId(null)
    setScore(null)
    setUserId(null)
  }

  const handleFormReset = () => {
    setSessionId(null)
    setScore(null)
    setUserId(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {currentView === 'form' && (
        <OnboardingForm 
          onComplete={handleOnboardingComplete} 
          onReset={handleFormReset}
        />
      )}
      
      {currentView === 'score' && sessionId && (
        <ScoreDisplay
          sessionId={sessionId}
          score={score || undefined}
          onViewHistory={handleViewHistory}
          onStartOver={handleStartOver}
        />
      )}
      
      {currentView === 'history' && (
        <ScoreHistory
          userId={userId}
          onBackToScore={handleBackToScore}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  )
}
