import NotFoundLayout from 'internal/layouts/not-found'
import RootClient from './root'
import { importTranslations } from '~/internal/utils/i18n'

export default async function NotFound() {
    const translations = importTranslations('en')
    return (
        <RootClient locale='en' translations={translations} style={{ display: 'none' }}>
            <NotFoundLayout />
        </RootClient>
    )
}