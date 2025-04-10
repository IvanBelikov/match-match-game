export type Card = {
  id: symbol
  icon: string
}

export type CardPairState = {
  icon: string
  cardState: {
    isMatched: boolean
    isFlipped: boolean
  }
}
