# Match-match game

Для запуска dev сервера 

```bash
npm run dev
```

## **Act JS** (собственный фреймворк, используемый в приложении)

### Создание Virtual Node и работа с Virtual Dom

В этой мини-библиотеке реализуется очень похожий алгоритм работы с внесением изменений в DOM как во многих других популярных библиотеках (React, VueJS).

Для взаимодействия с DOM создаётся виртуальное дерево компонентов `Vnode[]` которое содержит метаинформацию о каждом узле дерева (подобие FiberNode в React):

```ts
VNode = {
  [K in keyof HTMLElementTagNameMap]: {
    tag: K
    props?: Partial<HTMLElementTagNameMap[K]>
    children?: VNode[] | string
    $el?: HTMLElement
    listeners: Map<string, () => void>
  }
}[keyof HTMLElementTagNameMap]
  
```

- *tag* - html-элемент создаваемой ноды ('div', 'p', etc)
- *props* - это объект, который типизируется на основе переданного tag и содержит в себе перечисление всех возможных свойств для созданного *tag*
- *children* - принимает текстовое значение либо массив типа `VNode[]`
- *$el* - DOM-элемент, который привязвается к конкретной ноде при монтировании.
- *listeners* - объект типа `Map<string, () => void>`, который хранит в себе все слушатели событий, добавленный на элемент. 

`a <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]>,
  children?: VNode[] | string,
): VNode` - метод, аналогичный `createElement()` в React, который создаёт новый узел VNode.

`mount(vNode: VNode, container: HTMLElement): void ` - метод, который монитрует виртуальное VDOM-дерево в существующий DOM-элемент (e.g. `#app`)

`unmount(vNode: VNode): void` - метод, который размонтирует переданный DOM-элемент переданного `vNode`.

`patch(oldNode: VNode, newNode: VNode): void` - сравнивает 2 переданные vNode между собой и производит обновление в DOM-дерево на основе различий (вдохновлено React Reconcilation)

### Реактивность

`watchEffect(fn: (values?: EffectSignatureCallbackTypes) => void)` - метод для подписки на изменения реактивных переменных. Метод следит за всеми реактивными элементами. (для простоты реализации)

`reactive<T extends object>(obj: T): Reactive<T>` - метод, который создаёт реактивный объект. Все изменения свойств такого объекта отслеживаются в `watchEffect`.

