import fs from 'fs'
import path from 'path'
import dedent from 'ts-dedent'

const action = require('../src/actions/main')

it('render css text into <head>', async () => {
    const filePath = path.join(__dirname, './a.test.html')
    fs.rmSync(filePath, { force: true })
    fs.writeFileSync(filePath, dedent`
        <html>
            <head>
                <link rel="styleSheet">
                <style></style>
            </head>
            <body>
                <h1 class="text:center ml:0>:is(a,button):first font:32">Hello World</h1>
            </body>
        </html>
    `)
    await action(filePath)
    expect(fs.readFileSync(filePath, { encoding: 'utf-8' })).toMatch(dedent`
        <html>
            <head>
                <link rel="styleSheet">
                <style></style>
            <style id="master">.font\\:32{font-size:2rem}.ml\\:0\\>\\:is\\(a\\,button\\)\\:first>:is(a,button):first-child{margin-left:0rem}.text\\:center{text-align:center}</style></head>
            <body>
                <h1 class="text:center ml:0>:is(a,button):first font:32">Hello World</h1>
            </body>
        </html>
    `)
})

it('render css text into head and create <style id="master">', async () => {
    const filePath = path.join(__dirname, './b.test.html')
    fs.rmSync(filePath, { force: true })
    fs.writeFileSync(filePath, dedent`
        <html>
            <head>
                <link rel="styleSheet">
                <style></style>
                <style id="master"></style>
            </head>
            <body>
                <h1 class="top:10 font:48">Hello World</h1>
            </body>
        </html>
    `)
    await action(filePath)
    expect(fs.readFileSync(filePath, { encoding: 'utf-8' })).toMatch(dedent`
        <html>
            <head>
                <link rel="styleSheet">
                <style></style>
                <style id="master">.font\\:48{font-size:3rem}.top\\:10{top:0.625rem}</style>
            </head>
            <body>
                <h1 class="top:10 font:48">Hello World</h1>
            </body>
        </html>
    `)
})