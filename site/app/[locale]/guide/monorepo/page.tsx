import Layout from 'internal/layouts/doc'
import { getUnitCategories } from '~/site/metadata'
import metadata from './metadata'
/* @ts-expect-error toc */
import Content, { toc } from './content.mdx'
import generate from 'internal/utils/generate-metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

const pageCategories = getUnitCategories('guide')

export default async function Page(props: any) {
    return (
        <Layout {...props} $type="prose" pageCategories={pageCategories} pageDirname={__dirname} metadata={metadata} toc={toc} >
            <Content />
        </Layout >
    )
}