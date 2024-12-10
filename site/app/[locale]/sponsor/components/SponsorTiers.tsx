'use client'

import { useState } from 'react'
import { getSponsorTiers } from 'internal/utils/get-sponsor-tiers'
import TierModal from './TierModal'
import useRewritedPathname from 'internal/uses/rewrited-pathname'

export default function SponsorTiers() {
    const pathname = useRewritedPathname()
    const [selectedTier, setSelectedTier] = useState<any>()
    const sponsorTiers = getSponsorTiers(pathname || '')

    return <div className="gap:15 grid-cols:2 grid-cols:4@sm">
        {sponsorTiers.map((eachSponsorTier) => (
            <button key={eachSponsorTier.name} className="app-object app-object-interactive flex:col@<lg gap:20 p:25|30 r:5" onClick={() => setSelectedTier(eachSponsorTier)}>
                <div className="font:48">{eachSponsorTier.icon}</div>
                <div className='flex:1 text:left'>
                    <div className="uppercase::first-letter fg:strong font:semibold text:16">{eachSponsorTier.name}</div>
                    {eachSponsorTier.amount && (
                        <div className="font:bold text:14">
                            {eachSponsorTier.amount}
                            <span className="fg:neutral font:regular ml:5 text:12">
                                / {eachSponsorTier.one ? 'one-time' : 'month'}
                            </span>
                        </div>
                    )}
                </div>
            </button>
        ))}
        {selectedTier && <TierModal tierState={[selectedTier, setSelectedTier]} />}
    </div>
}