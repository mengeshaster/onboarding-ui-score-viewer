'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getScoreColor, getScoreBadgeColor } from '@/lib/utils'
import { CircularProgress } from './circular-progress'

interface ScoreDisplayProps {
  sessionId: string
  score?: number
  onViewHistory: () => void
  onStartOver: () => void
}

export function ScoreDisplay({ sessionId, score, onViewHistory, onStartOver }: ScoreDisplayProps) {
  if (!score) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your score...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 80) {
      return "Outstanding! You're well-prepared for investment opportunities."
    }
    if (score >= 60) {
      return "Good foundation! With some improvements, you'll be ready to invest."
    }
    if (score >= 40) {
      return "You're on the right track. Consider addressing a few areas before investing."
    }
    return "Focus on building your financial foundation before considering investments."
  }

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Your Investment Readiness Score</CardTitle>
          <CardDescription>
            Based on your financial profile and investment preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <CircularProgress score={score} />

          <div className="space-y-2">
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(score)}`}>
                {getScoreLabel(score)}
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {getScoreDescription(score)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Session ID</div>
              <div className="text-xs font-mono mt-1">{sessionId.slice(0, 8)}...</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-2xl font-bold text-primary">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Max Score</div>
              <div className="text-lg font-semibold">100</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" onClick={onViewHistory}>
          View Assessment History
        </Button>
        <Button onClick={onStartOver}>
          Take New Assessment
        </Button>
      </div>

      {/* Tips Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {score >= 80 ? (
              <>
                <p>• Consider diversifying your investment portfolio</p>
                <p>• Explore different asset classes based on your risk tolerance</p>
                <p>• Review and rebalance your investments regularly</p>
              </>
            ) : score >= 60 ? (
              <>
                <p>• Build a larger emergency fund if needed</p>
                <p>• Consider consulting with a financial advisor</p>
                <p>• Start with low-risk investments to gain experience</p>
              </>
            ) : (
              <>
                <p>• Focus on building an emergency fund first</p>
                <p>• Consider improving your debt-to-income ratio</p>
                <p>• Learn more about investing basics before starting</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
