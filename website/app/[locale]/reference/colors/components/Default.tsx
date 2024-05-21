'use client'

import { variables } from '@master/css'
// @ts-expect-error
import contrast from 'get-contrast'
import { snackbar } from 'websites/utils/snackbar'
import colorNames from '~/data/color-names'

export default () => <div className="gap-y:8x gap-y:5x@sm grid-cols:1 my:10x">
    {Object.keys(variables)
        // @ts-ignore todo fix this
        .filter((variableName) => variableName && colorNames.includes(variableName))
        .map((colorName: string) => {
            const eachColors = (variables as any)[colorName]
            return (
                <div className="gap-x:2x gap-y:3x gap-y:5x@sm grid-cols:6 grid-cols:12@sm" key={colorName}>
                    <div className="capitalize font:12 font:semibold grid-col-span:6@<sm leading:1.5 white-space:pre-line">
                        {colorName}
                    </div>
                    {Object.keys(eachColors)
                        .filter((level: any) => [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95].includes(+level))
                        .map((level: any) => {
                            const color = eachColors[level]
                            const backgroundHex = level === 100 ? '#000000' : color === 0 ? '#ffffff' : color
                            return (
                                <div key={color + level}>
                                    <div className="center-content flex aspect:3/2 cursor:pointer tracking:.5 outline-offset:-1 outline:1|solid outline:frame r:1x w:full"
                                        style={{ backgroundColor: backgroundHex }}
                                        onClick={() => {
                                            snackbar(
                                                `Copied <svg class="v:middle mt:-2 ml:4 mr:2 inline-block w:6 h:6 round bg:${backgroundHex}"></svg> <b>${backgroundHex}</b>`
                                            )
                                            navigator.clipboard.writeText(backgroundHex)
                                        }}
                                    >
                                        {/* <div className="info invisible leading:1">#{color}</div> */}
                                    </div>
                                    <code className="block font:12 mt:8">{level}</code>
                                    <code className="block fg:light font:10 font:regular mt:4">{color}</code>
                                    {/* <code className="block mt:4 font:10 fg:neutral">{ratio}</code> */}
                                </div>
                            )
                        })}
                </div>
            )
        })}
</div>