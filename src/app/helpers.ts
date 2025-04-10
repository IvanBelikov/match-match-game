export const shuffleArray = (array: string[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const toTimerFormat = (timerValue: number | null) => {
  if (!timerValue) {
    return '00:00'
  }

  const timerMs = timerValue % 100
  const timerMsRender =
    timerMs >= 10 ? timerMs.toString() : `0${timerMs.toString()}`

  const timerS = Math.floor(timerValue / 100)
  const timerSRender =
    timerS >= 10 ? timerS.toString() : `0${timerS.toString()}`

  return `${timerSRender}:${timerMsRender}`
}
