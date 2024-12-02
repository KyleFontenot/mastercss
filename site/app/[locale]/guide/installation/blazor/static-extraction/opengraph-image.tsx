import { Props } from 'internal/types/Props'
import create from 'internal/utils/og-image'
import metadata from './metadata'
import Icon from '~/site/public/images/frameworks/blazor.svg'
import type { AbsoluteTemplateString } from 'next/dist/lib/metadata/types/metadata-types'

export const alt = (metadata.title as AbsoluteTemplateString)?.absolute || metadata.title as string
export const contentType = 'image/jpg'
export const runtime = 'nodejs'

export default (props: Props) => create({
    props,
    metadata,
    title: 'Static Extraction',
    icon: <Icon width="256" />
})