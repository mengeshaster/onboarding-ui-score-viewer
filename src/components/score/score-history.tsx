'use client'

import { useState } from 'react'
import { useSessionsHistory } from '@/lib/hooks/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime, getScoreBadgeColor } from '@/lib/utils'
import { SessionSummary } from '@/lib/types/api'

interface ScoreHistoryProps {
  userId: string | null
  onBackToScore: () => void
  onStartOver: () => void
}

export function ScoreHistory({ userId, onBackToScore, onStartOver }: ScoreHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  
  const { data: response, isLoading, error } = useSessionsHistory(undefined, currentPage, pageSize)
  
  const sessions = response?.data || []
  const pagination = response?.pagination

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading your history...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center text-red-600">
            <p>Error loading your history. Please try again.</p>
            <Button onClick={onBackToScore} className="mt-4">
              Back to Score
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Score History</CardTitle>
          <CardDescription>Your assessment history will appear here</CardDescription>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No previous assessments found.</p>
            <div className="flex gap-4 justify-center mt-6">
              <Button variant="outline" onClick={onBackToScore}>
                Back to Score
              </Button>
              <Button onClick={onStartOver}>
                Take Your First Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>
            Your previous investment readiness assessments
            {pagination && (
              <span className="block mt-1 text-xs">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} assessments
              </span>
            )}
          </CardDescription>
          {/* Action buttons under the card description */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="outline" onClick={onBackToScore}>
              Back to Current Score
            </Button>
            <Button onClick={onStartOver}>
              Take New Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session: SessionSummary, index: number) => {
              const badgeColor = getScoreBadgeColor(session.score)
              // Calculate the assessment number based on total count and current page
              const assessmentNumber = pagination ? (pagination.total - ((currentPage - 1) * pageSize) - index) : (sessions.length - index)
              
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        Assessment #{assessmentNumber}
                      </h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                        Score: {session.score}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Taken on {formatDateTime(session.createdAt)}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Session ID: {session.id.slice(0, 8)}...
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {session.score}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      out of 100
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={!pagination.hasPrevPage}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {pagination.totalPages}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={!pagination.hasNextPage}
              >
                Last
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
