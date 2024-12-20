import Layout from 'internal/layouts/doc'
import metadata from './metadata'
import Content from './content.mdx'
import generate from 'internal/utils/generate-metadata'
import LogoSvg from '~/site/public/images/frameworks/vuejs.svg'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

import pageCategories from '~/site/.categories/guide.json'

export default async function Page(props: any) {
    return (
        <Layout {...props} pageCategories={pageCategories} pageDirname={import.meta.url}
            metadata={metadata}
            backOnClickCategory='/guide/code-linting'
            icon={<LogoSvg width={64} />}
        >
            <Content />
        </Layout >
    )
}