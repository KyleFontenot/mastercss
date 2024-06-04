import DocLayout from 'internal/layouts/reference'
import { getUnitCategories } from '~/site/metadata'
import Content from './content.mdx'
import metadata from './metadata'
import { createTranslation } from 'internal/utils/i18n'
import generate from 'internal/utils/generate-metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props} pageCategories={getUnitCategories('guide')} pageDirname={__dirname} metadata={metadata}>
            <Content />
        </DocLayout >
    )
}