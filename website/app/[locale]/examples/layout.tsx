import { Locale } from 'websites/i18n.config'
import RootLayout from '../root.layout'
import i18n from 'websites/i18n.config.mjs'

export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    }
}

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default async function Layout(props: {
    children: JSX.Element,
    params: { locale: Locale }
}) {
    return (
        <RootLayout {...props} />
    )
}
