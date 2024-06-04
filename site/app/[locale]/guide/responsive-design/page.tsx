import metadata from './metadata'
/* @ts-expect-error toc */
import Content, { toc } from './content.mdx'
import Layout from 'internal/layouts/doc'
import { getUnitCategories } from '~/site/metadata'
import generate from 'internal/utils/generate-metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Page(props: any) {
    return (
        <Layout {...props} pageCategories={getUnitCategories('guide')} pageDirname={__dirname} metadata={metadata} toc={toc}>
            <link rel="preload" href={'/' + props.params.locale + '/examples/responsive-gallery'} as="document" />
            <Content />
        </Layout >
    )
}