'use client'

import styled from '@master/styled.react'

const DocMain = styled.main(
    'mx:auto p:60|30@print pb:5x pb:20x@md pt:35x@md px:5x',
    ({ $hideRightSide, $hideLeftSide }) => ({
        'pr:85x@lg': !$hideRightSide,
        'max-w:screen-sm_:where(p)': $hideRightSide,
        'pl:75x@md pl:85x@lg': !$hideLeftSide,
    }),
    ({ $pt }) => `pt:${$pt || '20x'}`,
    ({ $hideRightSide, $hideLeftSide }) => $hideRightSide && $hideLeftSide ? 'max-w:screen-md' : 'max-w:screen-xl',

)

DocMain.defaultProps = {
    $hideRightSide: false,
    $hideLeftSide: false
}

export default DocMain