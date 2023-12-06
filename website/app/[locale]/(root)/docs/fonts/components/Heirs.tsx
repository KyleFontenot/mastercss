import { rules } from '../../../../../../../packages/css/src'

export default () => <>
    {
        Object.keys(rules)
            .filter((ruleName) => (rules as any)[ruleName].variables?.find((variable: string) => variable.includes('font-family')))
            .map((ruleName, index) =>
                <>
                    <code key={ruleName}>{ruleName}</code>
                    {index !== 0 && ', '}
                </>
            )
    }
    , and <code>font-family</code>
</>