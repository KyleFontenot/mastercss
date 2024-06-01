'use client'

import clsx from 'clsx'
import Demo from 'internal/components/Demo'
import Code from 'internal/components/Code'
import Bg from '~/components/Bg'

export default (props: any) =>
    <>
        <Demo>
            <Bg {...props} className={clsx(props.className, 'aspect:3/1 flex:0 size:full|48')} />
        </Demo>
        <Code lang="html">{`<div class="**${props.className}**">…</div>`}</Code>
    </>