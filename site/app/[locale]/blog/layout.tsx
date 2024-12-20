import Body from 'internal/layouts/body'
import i18n from 'internal/common/i18n.config.mjs'

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default async function Layout({ children }: {
    children: React.ReactElement
}) {
    return (
        <Body className="bg:base">
            {children}
        </Body>
    )
}