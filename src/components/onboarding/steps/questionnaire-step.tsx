import { UseFormReturn } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface QuestionnaireStepProps {
  form: UseFormReturn<OnboardingFormData>
}

const RISK_FLAG_OPTIONS = [
  { value: 'high-debt', label: 'I have significant debt (credit cards, loans)' },
  { value: 'no-emergency-fund', label: 'I do not have an emergency fund' },
  { value: 'unstable-income', label: 'My income is irregular or unstable' },
  { value: 'new-to-investing', label: 'I am completely new to investing' },
  { value: 'need-immediate-liquidity', label: 'I may need this money within the next year' },
  { value: 'no-financial-goals', label: 'I do not have clear financial goals' },
]

export function QuestionnaireStep({ form }: QuestionnaireStepProps) {
  const { setValue, watch } = form

  const selectedFlags = watch('flags') || []

  const handleFlagChange = (flagValue: string, checked: boolean) => {
    const currentFlags = selectedFlags
    if (checked) {
      setValue('flags', [...currentFlags, flagValue])
    } else {
      setValue('flags', currentFlags.filter(flag => flag !== flagValue))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Questions</h3>
        <p className="text-muted-foreground">
          Please select any that apply to your current situation. This helps us provide more accurate recommendations.
        </p>

        <div className="space-y-3">
          {RISK_FLAG_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={selectedFlags.includes(option.value)}
                onCheckedChange={(checked) => handleFlagChange(option.value, checked as boolean)}
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

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These questions help us identify potential risk factors. 
            Selecting these options does not disqualify you from investing but helps us provide 
            better tailored advice.
          </p>
        </div>
      </div>
    </div>
  )
}
