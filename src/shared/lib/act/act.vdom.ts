import { attributesMap } from './attributesMap'
import { syntheticEvents } from './syntheticEvents'
import type { VNode } from './types'

import { isEqual } from 'lodash'

// Create virtual node
export const a = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]>,
  children?: VNode[] | string,
) => ({ tag, props, children, listeners: new Map<string, () => void>() })

// Mount the virtual node to the DOM
export const mount = (vNode: VNode, container: HTMLElement) => {
  const el = document.createElement(vNode.tag)

  const listeners = vNode.listeners

  if (vNode.props) {
    for (const [key, value] of Object.entries(vNode.props)) {
      if (key in syntheticEvents) {
        const event = syntheticEvents[key as keyof typeof syntheticEvents]
        el.addEventListener(event, value)
        listeners.set(key, value)
      } else if (attributesMap[key as keyof typeof attributesMap]) {
        el.setAttribute(attributesMap[key as keyof typeof attributesMap], value)
      } else if (key === 'checked') {
        if (value) {
          el.setAttribute(key, '')
        }
      } else {
        el.setAttribute(key, value)
      }
    }
  }

  if (vNode.children) {
    if (typeof vNode.children === 'string') {
      el.textContent = vNode.children
    } else {
      vNode.children.forEach((child) => mount(child, el))
    }
  }

  container.appendChild(el)
  vNode.$el = el
  vNode.listeners = listeners
}

// Unmount the virtual node from the DOM
export const unmount = (vNode: VNode) => {
  if (!vNode.$el) {
    throw new Error(`There is no $el on node ${vNode}`)
  }
  vNode.$el.parentNode?.removeChild(vNode.$el)
}

// Compares 2 nodes and figures out the difference
export const patch = (oldNode: VNode, newNode: VNode) => {
  if (!oldNode.$el) {
    throw new Error(`There is no $el on node ${oldNode}`)
  }

  if (oldNode.tag !== newNode.tag) {
    const container = oldNode.$el.parentElement as HTMLElement
    mount(newNode, container)
    unmount(oldNode)
  } else {
    newNode.$el = oldNode.$el

    if (oldNode.props) {
      for (const [key, value] of Object.entries(oldNode.props)) {
        if (key in syntheticEvents) {
          oldNode.listeners.set(key, value)
        }
      }
    }

    if (!isEqual(oldNode.props, newNode.props)) {
      while (newNode.$el.attributes.length > 0) {
        newNode.$el.removeAttribute(newNode.$el.attributes[0].name)
      }

      if (newNode.props) {
        for (const [key, value] of Object.entries(newNode.props)) {
          if (!(key in syntheticEvents)) {
            if (attributesMap[key as keyof typeof attributesMap]) {
              newNode.$el.setAttribute(
                attributesMap[key as keyof typeof attributesMap],
                value,
              )
            } else if (key === 'checked') {
              if (value) {
                newNode.$el.setAttribute(key, '')
              }
            } else {
              newNode.$el.setAttribute(key, value)
            }
          } else {
            newNode.listeners.set(key, value)

            oldNode.listeners.forEach((value, key) => {
              if (newNode.$el) {
                newNode.$el.removeEventListener(
                  syntheticEvents[key as keyof typeof syntheticEvents],
                  value,
                )
              }
            })

            newNode.$el.addEventListener(
              syntheticEvents[key as keyof typeof syntheticEvents],
              value,
            )
          }
        }
      }
    }

    if (typeof newNode.children === 'string') {
      newNode.$el.textContent = newNode.children
    } else {
      if (typeof oldNode.children === 'string') {
        newNode.$el.textContent = null
        newNode.children?.forEach((child) =>
          mount(child, newNode.$el as HTMLElement),
        )
      } else {
        if (oldNode.children && newNode.children) {
          const commonLength = Math.min(
            oldNode.children.length,
            newNode.children.length,
          )

          for (let i = 0; i < commonLength; i++) {
            patch(oldNode.children[i], newNode.children[i])
          }

          if (oldNode.children.length > newNode.children.length) {
            oldNode.children
              .slice(newNode.children.length)
              .forEach((child) => unmount(child))
          }

          if (oldNode.children.length < newNode.children.length) {
            newNode.children
              .slice(oldNode.children.length)
              .forEach((child) => mount(child, newNode.$el as HTMLElement))
          }
        }
      }
    }
  }
}
