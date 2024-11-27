import { MasterCSS, config as defaultConfig } from '@master/css'
import type { Rule, Config } from '@master/css'

import './types/global'

export class RuntimeCSS extends MasterCSS {
    readonly host: Element
    readonly observing = false
    readonly progressive = false
    readonly container: HTMLElement | ShadowRoot
    observer?: MutationObserver | null
    constructor(
        public root: Document | ShadowRoot | undefined | null = document,
        public customConfig: Config = defaultConfig
    ) {
        super(customConfig)
        if (!root) this.root = document
        const rootConstructorName = this.root?.constructor.name
        if (rootConstructorName === 'HTMLDocument' || rootConstructorName === 'Document') {
            // @ts-ignore
            (this.root as Document).defaultView.globalThis.runtimeCSS = this
            this.container = (this.root as Document).head
            this.host = (this.root as Document).documentElement
        } else {
            this.container = this.root as RuntimeCSS['container']
            this.host = (this.root as ShadowRoot).host
        }
        runtimeCSSs.push(this)
    }

    /**
     * Observe the DOM for changes and update the running stylesheet. (browser only)
     * @param options mutation observer options
     * @returns this
     */
    observe(options: MutationObserverInit = { subtree: true, childList: true }) {
        if (this.observing || !this.root) return this
        if (runtimeCSSs.find((eachRuntimeCSS) => eachRuntimeCSS !== this && eachRuntimeCSS.root === this.root)) {
            console.warn('Cannot observe the same root element repeatedly.')
            return this
        }

        if (this.root?.styleSheets)
            for (const sheet of this.root.styleSheets) {
                const { ownerNode } = sheet
                if (ownerNode && (ownerNode as HTMLStyleElement).id === 'master') {
                    // @ts-ignore
                    this.style = ownerNode
                    // @ts-ignore
                    this.progressive = true
                    break
                }
            }

        if (this.style?.sheet) {
            let index = 0
            for (; index < this.style.sheet.cssRules.length; index++) {
                const eachCSSRule = this.style.sheet.cssRules[index]
                switch (eachCSSRule.constructor.name) {
                    case 'CSSKeyframesRule':
                        continue
                    case 'CSSMediaRule':
                        const result = /\(prefers-color-scheme: ?(.*?)\)/.exec((eachCSSRule as CSSMediaRule).conditionText)
                        if (result) {
                            const firstCSSRule = (eachCSSRule as CSSMediaRule).cssRules[0]
                            if (
                                firstCSSRule?.constructor.name === 'CSSStyleRule'
                                && (firstCSSRule as CSSStyleRule).selectorText === ':root'
                            ) {
                                this.pushVariableNativeRule(result[1], firstCSSRule as CSSStyleRule)
                                continue
                            }
                        }
                        break
                    case 'CSSStyleRule':
                        const selectorText = (eachCSSRule as CSSStyleRule).selectorText
                        if ((eachCSSRule as CSSStyleRule).style.length) {
                            let isVariablesRule = true
                            for (const style of (eachCSSRule as CSSStyleRule).style) {
                                if (!style.startsWith('--')) {
                                    isVariablesRule = false
                                    break
                                }
                            }
                            if (isVariablesRule) {
                                if (selectorText === ':root') {
                                    this.pushVariableNativeRule('', eachCSSRule as CSSStyleRule)
                                    continue
                                } else {
                                    const result = /:host(.*?)/.exec(selectorText)
                                    if (result) {
                                        this.pushVariableNativeRule(result[1], eachCSSRule as CSSStyleRule)
                                        continue
                                    } else if (!selectorText.startsWith('.\\$')) {
                                        const [mode] = selectorText.split(',')
                                        this.pushVariableNativeRule(mode.slice(1), eachCSSRule as CSSStyleRule)
                                        continue
                                    }
                                }
                            }
                        }
                        break
                }
                break
            }

            for (; index < this.style.sheet.cssRules.length; index++) {
                const getRule = (cssRule: any): Rule | undefined => {
                    if (cssRule.selectorText) {
                        const selectorTexts = cssRule.selectorText.split(', ')
                        const escapedClassNames = selectorTexts[0].split(' ')

                        for (const eachSelectorText of escapedClassNames) {
                            if (eachSelectorText[0] === '.') {
                                const escapedClassName = eachSelectorText.slice(1)

                                let className = ''
                                for (let j = 0; j < escapedClassName.length; j++) {
                                    const char = escapedClassName[j]
                                    const nextChar = escapedClassName[j + 1]

                                    if (char === '\\') {
                                        j++

                                        if (nextChar !== '\\') {
                                            className += nextChar

                                            continue
                                        }
                                    } else if ([',', '.', '#', '[', '!', '*', '>', '+', '~', ':', '@'].includes(char)) {
                                        break
                                    }

                                    className += char
                                }

                                if (
                                    !(Object.prototype.hasOwnProperty.call(this.ruleBy, className))
                                    && !(Object.prototype.hasOwnProperty.call(this.styles, className))
                                ) {
                                    const currentRule = this.generate(className)[0]
                                    if (currentRule)
                                        return currentRule
                                }
                            }
                        }
                    } else if (cssRule.cssRules) {
                        for (const rule of cssRule.cssRules) {
                            const currentRule = getRule(rule)
                            if (currentRule)
                                return currentRule
                        }
                    }
                }
                const rule = getRule(this.style.sheet.cssRules[index])
                if (rule) {
                    this.syntaxes.push(rule)
                    this.ruleBy[rule.className] = rule

                    for (let i = 0; i < rule.natives.length; i++) {
                        rule.natives[i].cssRule = this.style.sheet.cssRules[index + i]
                    }

                    index += rule.natives.length - 1

                    // variables
                    this.handleRuleWithVariableNames(rule, true)

                    // animations
                    this.handleRuleWithAnimationNames(rule, true)

                    rule.definition.insert?.call(rule)
                }
            }
        } else {
            // @ts-ignore
            this.style = document.createElement('style')
            this.style.id = 'master'
            this.container.append(this.style)
        }

        const handleClassList = (classList: DOMTokenList) => {
            classList.forEach((className) => {
                if (Object.prototype.hasOwnProperty.call(this.classesUsage, className)) {
                    this.classesUsage[className]++
                } else {
                    this.classesUsage[className] = 1

                    this.add(className)
                }
            })
        }

        handleClassList(this.host.classList)

        if (options.subtree) {
            /**
             * 待所有 DOM 結構完成解析後，開始繪製 Rule 樣式
             */
            ((this.root.constructor.name === 'HTMLDocument') ? this.host : this.container)
                .querySelectorAll('[class]')
                .forEach((element) => handleClassList(element.classList))
        }

        this.observer = new MutationObserver((mutationRecords) => {
            // console.time('css engine');
            const correctionOfClassName: Record<string, number> = {}
            const attributeMutationRecords: MutationRecord[] = []
            const updatedElements: Element[] = []
            const unchangedElements: Element[] = []

            /**
            * 取得所有深層後代的 class names
            */
            const handleClassNameDeeply = (element: Element, remove: boolean) => {
                if (remove) {
                    element.classList.forEach(removeClassName)
                } else {
                    element.classList.forEach(addClassName)
                }
                const children = element.children
                for (const eachChildren of children) {
                    if (eachChildren.classList && !updatedElements.includes(eachChildren)) {
                        updatedElements.push(eachChildren)
                        handleClassNameDeeply(eachChildren, remove)
                    }
                }
            }

            const addClassName = (className: string) => {
                if (Object.prototype.hasOwnProperty.call(correctionOfClassName, className)) {
                    correctionOfClassName[className]++
                } else {
                    correctionOfClassName[className] = 1
                }
            }

            const removeClassName = (className: string) => {
                if (Object.prototype.hasOwnProperty.call(correctionOfClassName, className)) {
                    correctionOfClassName[className]--
                } else if (Object.prototype.hasOwnProperty.call(this.classesUsage, className)) {
                    correctionOfClassName[className] = -1
                }
            }

            const handleNodes = (nodes: HTMLCollection, remove: boolean) => {
                for (const eachNode of nodes) {
                    if (eachNode.classList && !updatedElements.includes(eachNode) && !unchangedElements.includes(eachNode)) {
                        if (eachNode.isConnected !== remove) {
                            updatedElements.push(eachNode)
                            handleClassNameDeeply(eachNode, remove)
                        } else {
                            unchangedElements.push(eachNode)
                        }
                    }
                }
            }

            for (const mutationRecord of mutationRecords) {
                const { addedNodes, removedNodes, type, target } = mutationRecord
                if (type === 'attributes') {
                    /**
                     * 防止同樣的 MutationRecord 重複執行
                     * According to this history,
                     * MutationObserver was designed to work that way.
                     * Any call to setAttribute triggers a mutation,
                     * regardless of whether the value is being changed or set to the current value
                     */
                    if (attributeMutationRecords.find((eachAttributeMutationRecord) => eachAttributeMutationRecord.target === target)) {
                        continue
                    } else {
                        /**
                         * 第一個匹配到的 oldValue 一定是該批變動前的原始狀態值
                         */
                        attributeMutationRecords.push(mutationRecord)
                    }
                } else {
                    // 先判斷節點新增或移除
                    handleNodes(addedNodes as any, false)

                    // 忽略處理新元素的已刪除子節點
                    if (!target.isConnected || !updatedElements.includes(target as any)) {
                        handleNodes(removedNodes as any, true)
                    }
                }
            }

            if (!attributeMutationRecords.length && !Object.keys(correctionOfClassName).length) {
                // console.timeEnd('css engine');
                return
            }

            for (const { oldValue, target } of attributeMutationRecords) {
                /**
                 * 如果被操作的元素中包含了屬性變更的目標，
                 * 則將該目標從 existedAttributeMutationTargets 中移除，
                 * 以防止執行接下來的屬性變更處理
                 *
                 * 該批 mutationRecords 中，某個 target 同時有 attribute 及 childList 的變更，
                 * 則以 childList 節點插入及移除的 target.className 為主
                 */
                const updated = updatedElements.includes(target as Element)
                const classNames = (target as Element).classList
                const oldClassNames = oldValue ? oldValue.split(' ') : []
                if (updated) {
                    if (target.isConnected) {
                        continue
                    } else {
                        for (const oldClassName of oldClassNames) {
                            if (!classNames.contains(oldClassName)) {
                                removeClassName(oldClassName)
                            }
                        }
                    }
                } else if (target.isConnected) {
                    classNames.forEach((className) => {
                        if (!oldClassNames.includes(className)) {
                            addClassName(className)
                        }
                    })
                    for (const oldClassName of oldClassNames) {
                        if (!classNames.contains(oldClassName)) {
                            removeClassName(oldClassName)
                        }
                    }
                }
            }

            for (const className in correctionOfClassName) {
                const correction = correctionOfClassName[className]
                const count = (this.classesUsage[className] || 0) + correction
                if (count === 0) {
                    // remove
                    delete this.classesUsage[className]
                    /**
                     * class name 從 DOM tree 中被移除，
                     * 匹配並刪除對應的 rule
                     */
                    this.delete(className)
                } else {
                    if (!(Object.prototype.hasOwnProperty.call(this.classesUsage, className))) {
                        // add
                        /**
                         * 新 class name 被 connected 至 DOM tree，
                         * 匹配並創建對應的 Rule
                         */
                        this.add(className)
                    }

                    this.classesUsage[className] = count
                }
            }
        })

        this.observer.observe(this.root, {
            ...options,
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class'],
        });

        (this.host as HTMLElement).style.removeProperty('display')
        // @ts-ignore
        this.observing = true
        return this
    }

    refresh(customConfig: Config = this.customConfig) {
        // remove all CSS rules
        // todo: e2e test
        const sheet = this.style?.sheet
        if (sheet?.cssRules) {
            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                sheet.deleteRule(i)
            }
        }
        super.refresh(customConfig)
        return this
    }

    reset() {
        super.reset()
        const sheet = this.style?.sheet
        if (sheet?.cssRules) {
            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                sheet.deleteRule(i)
            }
        }
        if (!this.progressive) {
            this.style?.remove()
            // @ts-ignore
            this.style = null
        }
        return this
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect()
            this.observer = null
        }
        // @ts-ignore
        this.observing = false
        this.reset()
        return this
    }

    destroy() {
        this.disconnect()
        runtimeCSSs.splice(runtimeCSSs.indexOf(this), 1)
        return this
    }
}

export const runtimeCSSs: RuntimeCSS[] = [];

(() => {
    globalThis.RuntimeCSS = RuntimeCSS
    globalThis.runtimeCSSs = runtimeCSSs
})()