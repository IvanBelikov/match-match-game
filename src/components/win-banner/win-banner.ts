import { a } from '../../shared/lib/act'

import './styles.css'

export const WinBanner = () => {
  return a('div', { className: 'win-banner' }, [
    a('div', { className: 'win-content' }, [
      a('div', { className: 'trophy' }, '🏆'),
      a('span', {}, 'You won! All pairs found!'),
    ]),
  ])
}
