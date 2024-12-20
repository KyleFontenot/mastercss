import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Background',
    description: 'Setting all background style properties at once.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=background',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/background',
    filename: fileURLToPath(import.meta.url)
})

export default metadata