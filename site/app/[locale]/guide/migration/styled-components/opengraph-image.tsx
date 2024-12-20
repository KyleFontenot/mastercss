import { Props } from 'internal/types/Props'
import create from 'internal/utils/og-image'
import metadata from './metadata'
import type { AbsoluteTemplateString } from 'next/dist/lib/metadata/types/metadata-types'

export const alt = (metadata.title as AbsoluteTemplateString)?.absolute || metadata.title as string
export const contentType = 'image/jpg'
export const runtime = 'nodejs'

export default (props: Props) => create({
    props,
    metadata,
    title: 'Styled Components',
    // eslint-disable-next-line @next/next/no-img-element
    icon: <img src={require('!!url-loader!internal/images/styled-components.png').default} width={216} height={216} alt="styled components" />
})