import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Backdrop Filter',
    description: 'Style syntax for applying filter effects to the area behind an target element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=backdrop-filter',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter',
    filename: fileURLToPath(import.meta.url)
})

export default metadata