import { a } from '../../shared/lib/act'

import './styles.css'

type ToggleDifficultyProps = {
  isHard: boolean
  toggle: () => void
}

export const ToggleDiffuculty = ({ toggle, isHard }: ToggleDifficultyProps) => {
  return a('div', { className: 'difficulty-toggle', onclick: toggle }, [
    a('input', {
      type: 'checkbox',
      className: 'toggle-checkbox',
      id: 'difficulty-switch',
      checked: isHard,
    }),
    a('label', { className: 'toggle-label', htmlFor: 'difficulty-switch' }, [
      a('span', { className: 'toggle-text toggle-easy' }, 'Hard'),
      a('span', { className: 'toggle-text toggle-hard' }, 'Easy'),

      a('span', { className: 'toggle-handle' }),
    ]),
  ])
}
