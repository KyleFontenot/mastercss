import Layout from 'internal/layouts/article'
import metadata from './metadata'
/* @ts-expect-error toc */
import Content, { toc } from './content.mdx'
import generate from 'internal/utils/generate-metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Page() {
    return (
        <>
            <Layout pageDirname={import.meta.url} metadata={metadata} toc={toc} >
                <Content />
            </Layout >
        </>
    )
}