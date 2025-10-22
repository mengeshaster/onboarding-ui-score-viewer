import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getScoreColor } from '@/lib/utils'

interface ScoreBreakdownProps {
  breakdown: {
    profileCompleteness: number
    preferences: number
    questionnaire: number
  }
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const categories = [
    {
      name: 'Profile Completeness',
      score: breakdown.profileCompleteness,
      description: 'How complete your basic profile information is',
    },
    {
      name: 'Preferences',
      score: breakdown.preferences,
      description: 'Your communication and privacy preferences',
    },
    {
      name: 'Questionnaire',
      score: breakdown.questionnaire,
      description: 'Your responses to experience and goal questions',
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{category.name}</span>
              <span className={`font-bold ${getScoreColor(category.score)}`}>
                {category.score}/100
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  category.score >= 80
                    ? 'bg-green-500'
                    : category.score >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${category.score}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}