'use client'

import { RedirectsProvider } from 'internal/contexts/redirects'
import { LocaleProvider } from 'internal/contexts/locale'
import { I18nProvider } from 'internal/contexts/i18n'
import redirects from '~/redirects.mjs'
import { Analytics } from '@vercel/analytics/react'
import config from '~/master.css'
import CSSRuntimeProvider from '@master/css.react'
import ThemeModeProvider from '@master/theme-mode.react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import i18n from '~/i18n.config.mjs'
import { SearchProvider } from 'internal/contexts/search'

export default function Client({ children, locale, translations }: any) {
    return (
        <>
            <ThemeModeProvider preference='system'>
                <CSSRuntimeProvider config={config}>
                    <RedirectsProvider value={redirects}>
                        <I18nProvider value={{ ...i18n, translations }}>
                            <LocaleProvider value={locale}>
                                <SearchProvider>
                                    {children}
                                </SearchProvider>
                            </LocaleProvider>
                        </I18nProvider>
                    </RedirectsProvider>
                </CSSRuntimeProvider>
            </ThemeModeProvider>
            <Analytics />
            <SpeedInsights />
        </>
    )
}