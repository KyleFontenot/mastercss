import SyntaxType from '../syntax-type'
import MasterCSS from '../core'

/**
 * Sorts classes in a consistent order
 * @param classes
 * @param options
 * @returns consistent classes
 */
export default function reorderForReadableClasses(classes: string[], css = new MasterCSS()) {
    css.add(...classes)
    const orderedClasses = css.normalLayer.rules
        // 只保留樣式語法相關的 syntaxes, 排除 keyframes 與 variables 在外
        .filter(eachRule => eachRule.syntaxType)
        .sort((a, b) => {
            if (a.syntaxType === SyntaxType.Utility && b.syntaxType !== SyntaxType.Utility) {
                // 如果 a 是 Layer.Utility 而 b 不是，则 a 应该排在 b 前面
                return -1
            } else if (a.syntaxType !== SyntaxType.Utility && b.syntaxType === SyntaxType.Utility) {
                // 如果 b 是 Layer.Utility 而 a 不是，则 b 应该排在 a 前面
                return 1
            } else if (a.id !== b.id) {
                return a.name.localeCompare(b.name)
            } else {
                // 檢查 vendorSuffixSelectors 是否存在
                const aHasVendorSuffix = a.vendorSuffixSelectors?.['']?.[0]
                const bHasVendorSuffix = b.vendorSuffixSelectors?.['']?.[0]

                if (a.priority === -1 && b.priority === -1) {
                    // 如果 a 和 b 都有 vendorSuffixSelectors 或 media.token，則按照以下規則排序
                    if (aHasVendorSuffix && bHasVendorSuffix) {
                        return aHasVendorSuffix.localeCompare(bHasVendorSuffix)
                    }

                    // 檢查 media.token 是否存在
                    const aAtToke = a.atToken
                    const bAtToken = b.atToken

                    // 如果 a 和 b 都有 media.token 且不包含內建已處理過排序的，則按照以下規則排序
                    if (aAtToke && bAtToken
                        && !a.at.media?.find((({ name }: any) => name === 'min-width' || name === 'max-width'))
                        && !b.at.media?.find((({ name }: any) => name === 'min-width' || name === 'max-width'))
                    ) {
                        return aAtToke.localeCompare(bAtToken)
                    }

                    if (aHasVendorSuffix && !bHasVendorSuffix) {
                        return 1
                    } else if (!aHasVendorSuffix && bHasVendorSuffix) {
                        return -1
                    }
                    if (aAtToke && !bAtToken) {
                        return 1
                    } else if (!aAtToke && bAtToken) {
                        return -1
                    }
                }

                // 如果 a 和 b 的 id 相同，則按照以下規則排序
                if (
                    a.id === b.id &&
                    a.stateToken === b.stateToken
                ) {
                    return a.name.localeCompare(b.name)
                }

                // 再按照 rule.order 本身來升序排列
                return a.order - b.order
            }
        })
        .map(eachRule => eachRule.name)
    css.remove(...classes)
    return orderedClasses
}