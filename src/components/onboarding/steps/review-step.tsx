import { UseFormReturn } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'

interface ReviewStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function ReviewStep({ form }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review Your Information</h3>
        
        <div className="p-6 bg-muted rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">
            Please review the information you've provided before submitting your assessment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Personal Information:</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Age: {form.watch('age') || 'Not specified'}</li>
                <li>Annual Income: ${form.watch('income')?.toLocaleString() || 'Not specified'}</li>
                <li>Employment: {form.watch('employment') || 'Not specified'}</li>
                <li>Education: {form.watch('education') || 'Not specified'}</li>
              </ul>
            </div>
            
            <div>
              <strong>Investment Preferences:</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Risk Tolerance: {form.watch('riskTolerance') || 'Not specified'}</li>
                <li>Investment Goals: {form.watch('investmentGoals')?.join(', ') || 'Not specified'}</li>
                <li>Time Horizon: {form.watch('timeHorizon') || 'Not specified'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Ready to get your investment score?</strong><br />
            Click "Complete Assessment" to receive your personalized investment readiness score and recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}
