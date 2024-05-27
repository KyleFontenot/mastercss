import Image from 'next/image'
import Link from 'websites/components/Link'
import toSlug from 'websites/utils/toSlug'
import clsx from 'clsx'

export default function Backers({ backers }: any) {
    return <div className="gap:8 grid-cols:6 grid-cols:8@2xs grid-cols:10@xs grid-cols:14@sm grid-cols:18@md">
        {backers.map((eachBacker: any, i: number) => {
            let href = eachBacker.websiteUrl || eachBacker.twitterUrl || eachBacker.githubUrl
            if (href && !href?.startsWith('http://') && !href?.startsWith('https://')) {
                // 如果沒有，根據需要自動加上
                href = 'https://' + href // 或是 "http://" + url;
            }
            const className = `rel block round aspect:1/1 content:''::after`
            const Avatar = () =>
                <>
                    <Image src={eachBacker.avatarUrl} alt="avatar" className="full round object:cover" width="64" height="64" />
                    <div className="abs round bg:base bottom:-3 h:22 p:2 right:-3 w:22">
                        <Image src={'/images/' + toSlug(eachBacker.from) + '.svg'} alt="source" width="18" height="18" />
                    </div>
                </>
            return (
                href
                    ? <Link key={'backer-' + i} href={href} className={clsx(className, 'scale(1.1):hover ~transform|.2s')}><Avatar /></Link>
                    : <div key={'backer-' + i} className={className}><Avatar /></div>
            )
        })}
        <Link href="#become-a-backer" className="app-object app-object-interactive round aspect:1/1 flex:col">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z" />
            </svg>
        </Link>
    </div>
}