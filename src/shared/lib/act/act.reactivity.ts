import type {
  EffectSignature,
  EffectSignatureCallbackTypes,
  Reactive,
} from './types'

let acitveEffect: EffectSignature | null = null
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const activeStates = new Map<symbol, Reactive<any>>()

export function watchEffect(
  fn: (values?: EffectSignatureCallbackTypes) => void,
) {
  acitveEffect = fn
  fn()
  // acitveEffect = null
}

export class Dependency {
  subscribers: Set<EffectSignature>

  constructor() {
    this.subscribers = new Set()
  }

  depend() {
    if (acitveEffect) {
      this.subscribers.add(acitveEffect)
    }
  }

  notify(key: string, newValue: unknown) {
    this.subscribers.forEach((subscriber) => subscriber({ key, newValue }))
  }
}

export function reactive<T extends object>(obj: T): Reactive<T> {
  const objKeys = Object.keys(obj) as Array<keyof T>

  objKeys.forEach((key) => {
    const dependency = new Dependency()
    let value = obj[key]

    Object.defineProperty(obj, key, {
      get() {
        dependency.depend()
        return value
      },
      set(newValue) {
        if (newValue !== value) {
          value = newValue
          dependency.notify(key as string, newValue)
        }
      },
    })
  })

  return obj
}
