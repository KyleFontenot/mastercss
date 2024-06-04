import { Body } from 'internal/layouts/root'
import metadata from './metadata'
import generate from 'internal/utils/generate-metadata'
import Script from 'next/script'
import AvoidFOUCScript from '~/internal/components/AvoidFOUCScript'

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Layout({ children }: {
    children: JSX.Element
}) {
    return (
        <Body className="bg:base">
            <AvoidFOUCScript />
            {children}
        </Body>
    )
}
