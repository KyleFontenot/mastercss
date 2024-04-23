import defineVisitors from '../utils/define-visitors'
import resolveContext from '../utils/resolve-context'
import findLoc from '../utils/find-loc'
import { parseNodeRecursive } from '../utils/parse-node-recursive'
import validate from '../functions/validate'
import createRule from '../create-rule'
import settingsSchema from '../settings-schema'

export default createRule({
    name: 'syntax-error-checks',
    meta: {
        type: 'problem',
        docs: {
            description: 'Detect syntax errors early when writing classes',
            recommended: 'recommended'
        },
        messages: {
            invalidClass: '{{message}}',
            disallowUnknownClass: '{{message}}',
        },
        fixable: null,
        schema: [settingsSchema]
    },
    defaultOptions: [],
    create: function (context) {
        const { options, settings } = resolveContext(context)
        const visitNode = (node, arg = null) => {
            parseNodeRecursive(
                node,
                arg,
                (classNames, node) => {
                    const sourceCode = context.sourceCode
                    const sourceCodeLines = sourceCode.lines
                    const nodeStartLine = node.loc.start.line
                    const nodeEndLine = node.loc.end.line
                    for (const className of classNames) {
                        const { isMasterCSS, errors } = validate(className, settings.config)
                        if (errors.length > 0) {
                            for (const error of errors) {
                                if (isMasterCSS) {
                                    context.report({
                                        loc: findLoc(className, sourceCodeLines, nodeStartLine, nodeEndLine),
                                        messageId: 'invalidClass',
                                        data: {
                                            message: error.message + '.',
                                        }
                                    })
                                } else if (options.disallowUnknownClass) {
                                    context.report({
                                        loc: findLoc(className, sourceCodeLines, nodeStartLine, nodeEndLine),
                                        messageId: 'disallowUnknownClass',
                                        data: {
                                            message: `"${className}" is not a valid or known class.`
                                        }
                                    })
                                }
                            }
                        }
                    }
                },
                false,
                false,
                settings.ignoredKeys,
                context
            )
        }
        return defineVisitors({ context, settings }, visitNode)
    },
})