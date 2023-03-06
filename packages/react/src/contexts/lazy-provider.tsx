import { Config, MasterCSS, registeredCSS } from '@master/css'
import { ReactElement, useEffect, useState } from 'react'
import { CSSContext } from './css'

export const CSSLazyProvider = ({
    children,
    config,
    root = typeof document !== 'undefined' ? document : null
}: {
    children: ReactElement,
    config?: Config | Promise<any>,
    root?: Document | ShadowRoot | null
}) => {
    const [css, setCSS] = useState<MasterCSS>()
    useEffect(() => {
        if (!css) {
            Promise.all([import('@master/css'), config])
                .then(([{ MasterCSS }, configModule]) => {
                    const existingCSS = registeredCSS.find((eachCSS) => eachCSS.root === root)
                    const resolvedConfig = configModule.config || configModule.default || configModule
                    setCSS(existingCSS || new MasterCSS({ ...resolvedConfig }))
                })
        }
    }, [config, css, root])
    return <CSSContext.Provider value={css}>{children}</CSSContext.Provider>
}