import { App } from './app'

const container = document.querySelector<HTMLDivElement>('#app')

if (!container) {
  throw new Error('There is no element on page with #app')
}

App(container)
