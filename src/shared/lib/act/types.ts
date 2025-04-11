export type VNode = {
  [K in keyof HTMLElementTagNameMap]: {
    tag: K
    props?: Partial<HTMLElementTagNameMap[K]>
    children?: VNode[] | string
    $el?: HTMLElement
    listeners: Map<string, () => void>
  }
}[keyof HTMLElementTagNameMap]

export type EffectSignatureCallbackTypes = {
  key: string
  newValue: unknown
}

export type EffectSignature = ({
  key,
  newValue,
}: EffectSignatureCallbackTypes) => void

export type Reactive<T extends object> = {
  [K in keyof T]: T[K]
}
