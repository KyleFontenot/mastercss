import { Config } from '@master/css'
import card from './styles/card.css'

export default {
    extends: [
        card
    ],
    styles: {
        btn: `inline-flex text:center`
    },
    variables: {
        foo: 123,
        global: '#ff00ff'
    }
} as Config
