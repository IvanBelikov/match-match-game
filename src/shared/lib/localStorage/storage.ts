class StorageService {
  setBestScore(data: unknown) {
    const key = 'bestScore'
    if (typeof data === 'string') {
      localStorage.setItem(key, data)
    }

    if (typeof data === 'number') {
      localStorage.setItem(key, data.toString())
    }
  }

  getBestScore() {
    const score = localStorage.getItem('bestScore')

    if (!score) {
      return null
    }

    return Number.parseInt(score)
  }
}

export const storage = new StorageService()
