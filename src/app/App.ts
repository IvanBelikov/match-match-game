import { a, mount, patch, reactive, watchEffect } from '../shared/lib/act'
import type { VNode } from '../shared/lib/act'

import './App.styles.css'

import { icons } from './config'

import winSound from '../shared/assets/sounds/win-sound.wav'

import { GameCard, ToggleDiffuculty, WinBanner } from '../components'
import { shuffleArray, toTimerFormat } from './helpers'

import type { CardPairState } from '../shared/types'
import type { Card } from '../shared/types/types'
import { storage } from '../shared/lib/localStorage'

type AppState = {
  theme: 'light' | 'dark'
  timerId: number
  timerValue: number
  isHard: boolean
  isPlay: boolean
  isWinMessage: boolean
  cardsList: Card[]
  pair: CardPairState[]
  matchedCount: number
  bestScore: number | null
}

export const App = (parent: HTMLElement) => {
  let currentNode: VNode | null = null

  const state = reactive<AppState>({
    theme: 'light',
    timerId: 0,
    timerValue: 0,
    isHard: false,
    isPlay: false,
    isWinMessage: false,
    matchedCount: 0,
    cardsList: shuffleArray([...icons.slice(2), ...icons.slice(2)]).map(
      (icon) => ({ id: Symbol(), icon }),
    ),
    pair: [],
    bestScore: storage.getBestScore(),
  })

  const toggleTheme = () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
  }

  const startTimer = () => {
    state.timerId = setInterval(() => {
      const newValue = state.timerValue + 1
      state.timerValue = newValue
    }, 10)
  }

  const stopTimer = () => {
    clearInterval(state.timerId)
  }

  const shuffleCards = () => {
    if (state.isHard) {
      state.cardsList = shuffleArray([...icons, ...icons]).map((icon) => ({
        id: Symbol(),
        icon,
      }))
    } else {
      state.cardsList = shuffleArray([
        ...icons.slice(2),
        ...icons.slice(2),
      ]).map((icon) => ({ id: Symbol(), icon }))
    }
  }

  const toggleDifficulty = () => {
    if (!state.isPlay) {
      state.isHard = !state.isHard
      shuffleCards()
    }
  }

  const start = () => {
    reset()
    state.isPlay = true
    state.isWinMessage = false
    startTimer()
  }

  const reset = () => {
    stopTimer()
    state.isPlay = false
    state.isWinMessage = false
    state.timerId = 0
    state.timerValue = 0
    state.matchedCount = 0
    state.pair = []

    shuffleCards()
  }

  const endGame = () => {
    stopTimer()

    new Audio(winSound).play()

    state.isPlay = false
    state.isWinMessage = true

    if (!state.bestScore || state.timerValue < state.bestScore) {
      state.bestScore = state.timerValue
    }

    storage.setBestScore(state.bestScore)
  }

  const addToPair = (pair: CardPairState) => {
    state.pair = [...state.pair, pair]
  }

  const render = (renderState: AppState, newValueKey?: string) => {
    if (newValueKey === 'theme') {
      document.body.setAttribute('data-theme', renderState.theme)
    }

    if (state.pair.length === 2) {
      const stateCopy = [...state.pair]
      setTimeout(() => {
        if (stateCopy[0].icon === stateCopy[1].icon) {
          stateCopy[0].cardState.isMatched =
            stateCopy[1].cardState.isMatched = true
          state.matchedCount += 1
        } else {
          stateCopy[0].cardState.isFlipped =
            stateCopy[1].cardState.isFlipped = false
        }
      }, 400)

      state.pair = []
    }

    if (state.matchedCount === state.cardsList.length / 2) {
      state.matchedCount = 0
      endGame()
    }

    return a('main', {}, [
      a('div', { className: 'theme-switcher' }, [
        a('button', { id: 'themeToggle', onclick: toggleTheme }, '🌓'),
      ]),
      a(
        'p',
        { className: 'best-score' },
        `Best score: ${toTimerFormat(state.bestScore)}`,
      ),
      a('div', { className: 'game-container' }, [
        a('header', { className: 'game-header' }, [
          a('h1', {}, 'Match-match game'),
          a('div', { className: 'game-info' }, [
            ToggleDiffuculty({
              toggle: toggleDifficulty,
              isHard: state.isHard,
            }),
            a('div', { className: 'timer-container' }, [
              a(
                'span',
                { className: 'timer' },
                `Timer ${toTimerFormat(state.timerValue)}`,
              ),
            ]),
            state.isPlay
              ? a(
                  'button',
                  { className: 'restart-btn', onclick: reset },
                  'Reset',
                )
              : a(
                  'button',
                  { className: 'start-btn', onclick: start },
                  'New game',
                ),
          ]),
        ]),
        a('div', { className: 'game-board', id: 'gameBoard' }, [
          ...state.cardsList.map((card) =>
            GameCard(card.id, {
              icon: card.icon,
              isPlay: state.isPlay,
              addToPair: addToPair,
            }),
          ),
        ]),
      ]),
      state.isWinMessage ? WinBanner() : a('span', {}),
    ])
  }

  watchEffect((newValue) => {
    if (!currentNode) {
      currentNode = render(state, newValue?.key)
      mount(currentNode, parent)
    } else {
      const newNode = render(state, newValue?.key)
      patch(currentNode, newNode)
      currentNode = newNode
    }
  })
}
