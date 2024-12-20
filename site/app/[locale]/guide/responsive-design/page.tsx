import metadata from './metadata'
/* @ts-expect-error toc */
import Content, { toc } from './content.mdx'
import Layout from 'internal/layouts/doc'
import generate from 'internal/utils/generate-metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

import pageCategories from '~/site/.categories/guide.json'

export default async function Page(props: any) {
    const { locale } = await props.params
    return (
        <Layout {...props} $type="prose" pageCategories={pageCategories} pageDirname={__dirname} metadata={metadata} toc={toc}>
            <link rel="preload" href={'/' + locale + '/examples/responsive-gallery'} as="document" />
            <Content />
        </Layout >
    )
}