import { a, activeStates, reactive } from '../../shared/lib/act'
import type { CardPairState } from '../../shared/types'

import './styles.css'

type GameCardProps = {
  icon: string
  isPlay: boolean
  addToPair: (pair: CardPairState) => void
}

type GameCardState = {
  isFlipped: boolean
  isMatched: boolean
}

export function GameCard(
  id: symbol,
  { icon, isPlay, addToPair }: GameCardProps,
) {
  let state = activeStates.get(id) as GameCardState
  if (!state) {
    state = reactive<GameCardState>({
      isFlipped: false,
      isMatched: false,
    })
    activeStates.set(id, state)
  }

  const handleFlip = () => {
    if (!state.isFlipped && isPlay) {
      state.isFlipped = true
      addToPair({ icon, cardState: state })
    }
  }

  return a(
    'div',
    {
      className: `card ${state.isFlipped && 'flipped'}`,
      onclick: handleFlip,
    },
    [
      a('div', { className: 'card-face card-front' }, icon),
      a('div', { className: 'card-face card-back' }),
    ],
  )
}
