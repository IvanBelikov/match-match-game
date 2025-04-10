type Props = Record<string, string | (() => void) | unknown>

export function areListenersEqual(
  oldListeners: Map<string, () => void>,
  newListeners: Map<string, () => void>,
) {
  if (oldListeners.size !== newListeners.size) return false

  for (const [key, oldFn] of oldListeners) {
    if (!newListeners.has(key)) return false

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const newFn = newListeners.get(key)!

    if (oldFn.name !== newFn.name || oldFn.toString() !== newFn.toString()) {
      return false
    }
  }

  return true
}

export function haveListenersCanged(oldProps: Props, newProps: Props): boolean {
  const newKeys = Object.keys(newProps)

  for (const key of newKeys) {
    const oldValue = oldProps[key]
    const newValue = newProps[key]

    if (typeof oldValue === 'function' && typeof newValue === 'function') {
      if (oldValue.name !== newValue.name) {
        return true
      }
    }
  }

  return false
}

export function filterOutEventHandlers(props: Props): Props {
  const filteredProps: Props = {}

  for (const key in props) {
    const value = props[key]
    // Оставляем только НЕ-функции
    if (typeof value !== 'function') {
      filteredProps[key] = value
    }
  }

  return filteredProps
}
