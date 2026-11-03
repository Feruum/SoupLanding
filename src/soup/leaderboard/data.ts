import kaggleData from './kaggle.json'

// Measured runs from the participants' unofficial table of public Kaggle notebooks.
export type KaggleTeam = {
  place: number
  team: string
  speedup: number
  memory: number
  peak_mib: number
  loss_pct: number
  points: number
  kaggle?: string
  github?: string
}
export const kaggle = kaggleData as unknown as {
  notebooks: number
  window: [string, string]
  best: { speedup: number; memory: number }
  incomplete: string[]
  teams: KaggleTeam[]
}

export const format = (language: string) => {
  const number = new Intl.NumberFormat(language, { maximumFractionDigits: 2 })
  const fine = new Intl.NumberFormat(language, { maximumFractionDigits: 3 })
  const points = new Intl.NumberFormat(language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return {
    ratio: (value: number) => `${fine.format(value)}×`,
    pct: (value: number) =>
      Math.abs(value) < 0.0005
        ? '0%'
        : `${value > 0 ? '+' : ''}${fine.format(value)}%`,
    number: (value: number) => number.format(value),
    points: (value: number) => points.format(value),
  }
}
