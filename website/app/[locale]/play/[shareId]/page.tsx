import Play, { PlayShare } from '../Play'
import app from 'websites/firebase-admin-app'
import { initializeFirestore } from 'firebase-admin/firestore'
import { notFound } from 'next/navigation'
import { collectDictionary } from 'websites/dictionaries'
import { Suspense } from 'react'

export const dynamic = 'force-static'
export const revalidate = false

export default async function Page(props: any) {
    const store = initializeFirestore(app)
    const { shareId, locale } = props.params
    if (!shareId) {
        notFound()
    }
    let shareItem: PlayShare | null = null
    const shareItemRef = store.doc(`sandbox/${shareId}`)
    const doc = await shareItemRef.get()
    if (doc.exists) {
        shareItem = doc.data() as PlayShare
        return (
            <Play shareItem={shareItem}
                shareId={shareId}
                locale={locale}
                dict={await collectDictionary(locale, ['Docs', 'Play', 'Roadmap', 'Blog', 'Components', 'Sharing ...', 'Share'])}
            />
        )
    } else {
        notFound()
    }
}