import { UseFormReturn } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface PreferencesStepProps {
  form: UseFormReturn<OnboardingFormData>
}

const INVESTMENT_GOAL_OPTIONS = [
  { value: 'retirement', label: 'Retirement Planning' },
  { value: 'wealth-building', label: 'Wealth Building' },
  { value: 'income', label: 'Generate Income' },
  { value: 'education', label: 'Education Funding' },
  { value: 'emergency', label: 'Emergency Fund' },
  { value: 'other', label: 'Other' },
]

export function PreferencesStep({ form }: PreferencesStepProps) {
  const { formState: { errors }, setValue, watch } = form

  const selectedGoals = watch('investmentGoals') || []

  const handleGoalChange = (goalValue: string, checked: boolean) => {
    const currentGoals = selectedGoals
    if (checked) {
      setValue('investmentGoals', [...currentGoals, goalValue])
    } else {
      setValue('investmentGoals', currentGoals.filter(goal => goal !== goalValue))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Investment Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Risk Tolerance *</Label>
            <Select
              value={watch('riskTolerance') || undefined}
              onValueChange={(value) => setValue('riskTolerance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minimize risk, preserve capital</SelectItem>
                <SelectItem value="moderate">Moderate - Balanced risk and return</SelectItem>
                <SelectItem value="high">High - Higher risk for higher potential returns</SelectItem>
              </SelectContent>
            </Select>
            {errors.riskTolerance && (
              <p className="text-sm text-red-600">{errors.riskTolerance.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeHorizon">Investment Time Horizon *</Label>
            <Select
              value={watch('timeHorizon') || undefined}
              onValueChange={(value) => setValue('timeHorizon', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your time horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short Term (1-3 years)</SelectItem>
                <SelectItem value="medium">Medium Term (3-10 years)</SelectItem>
                <SelectItem value="long">Long Term (10+ years)</SelectItem>
              </SelectContent>
            </Select>
            {errors.timeHorizon && (
              <p className="text-sm text-red-600">{errors.timeHorizon.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Investment Goals * (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INVESTMENT_GOAL_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedGoals.includes(option.value)}
                  onCheckedChange={(checked) => handleGoalChange(option.value, checked as boolean)}
                />
                <Label
                  htmlFor={option.value}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.investmentGoals && (
            <p className="text-sm text-red-600">{errors.investmentGoals.message}</p>
          )}
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This information helps us provide personalized investment recommendations. 
            Your privacy is important to us and this data will be used solely for assessment purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
