import { UseFormReturn } from 'react-hook-form'
import { OnboardingFormData } from '@/lib/validations/onboarding'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BasicInfoStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const { register, formState: { errors }, setValue, watch } = form

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              {...register('age', { valueAsNumber: true })}
              placeholder="Enter your age"
            />
            {errors.age && (
              <p className="text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">Annual Income *</Label>
            <Input
              id="income"
              type="number"
              min="0"
              step="1000"
              {...register('income', { valueAsNumber: true })}
              placeholder="Enter your annual income"
            />
            {errors.income && (
              <p className="text-sm text-red-600">{errors.income.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employment">Employment Status *</Label>
            <Select
              value={watch('employment') || undefined}
              onValueChange={(value) => setValue('employment', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-Time</SelectItem>
                <SelectItem value="part-time">Part-Time</SelectItem>
                <SelectItem value="self-employed">Self-Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            {errors.employment && (
              <p className="text-sm text-red-600">{errors.employment.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education Level *</Label>
            <Select
              value={watch('education') || undefined}
              onValueChange={(value) => setValue('education', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School</SelectItem>
                <SelectItem value="bachelors">Bachelors Degree</SelectItem>
                <SelectItem value="masters">Masters Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.education && (
              <p className="text-sm text-red-600">{errors.education.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
