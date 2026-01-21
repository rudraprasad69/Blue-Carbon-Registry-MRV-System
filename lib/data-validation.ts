export interface ValidationRule {
  name: string
  validate: (value: any) => boolean
  errorMessage: string
}

export interface DataQuality {
  overall: number
  confidence: number
  source: string
  dataAge: number
}

export const validationRules = {
  price: {
    name: "Price Validation",
    validate: (value: number) => value > 0 && value < 10000,
    errorMessage: "Price must be between 0 and 10000",
  },
  credits: {
    name: "Credits Validation",
    validate: (value: number) => value > 0 && Number.isInteger(value),
    errorMessage: "Credits must be a positive integer",
  },
  sequestrationRate: {
    name: "Sequestration Rate Validation",
    validate: (value: number) => value > 0 && value < 20,
    errorMessage: "Sequestration rate must be between 0 and 20",
  },
}

export function calculateDataQuality(dataAge: number, source: string): DataQuality {
  let ageScore = 100
  if (dataAge > 24) ageScore = 80
  if (dataAge > 48) ageScore = 60
  if (dataAge > 72) ageScore = 40

  const sourceWeights: Record<string, number> = {
    verified: 100,
    satellite: 95,
    blockchain: 98,
    field: 90,
    sensor: 92,
  }

  const sourceScore = sourceWeights[source] || 70
  const overall = Math.round((ageScore + sourceScore) / 2)
  const confidence = Math.min(100, Math.round(overall * 0.95))

  return {
    overall,
    confidence,
    source,
    dataAge,
  }
}

export function validateData(data: Record<string, any>, rules: Record<string, ValidationRule>): boolean {
  for (const [key, rule] of Object.entries(rules)) {
    if (key in data && !rule.validate(data[key])) {
      console.warn(`Validation failed for ${key}: ${rule.errorMessage}`)
      return false
    }
  }
  return true
}
