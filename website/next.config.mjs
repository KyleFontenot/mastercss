import redirects from './redirects.mjs'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'
import withMDX from 'internal/width-mdx.mjs'
import withWebpackConfig from 'internal/with-webpack-config.mjs'
import withBundleAnalyzer from 'internal/with-bundle-analyzer.mjs'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: process.env.VERCEL_CI ? false : true,
    },
    experimental: {
        /**
         * 解決 JavaScript heap out of memory 問題
         */
        webpackBuildWorker: true,
        /**
         * 不要啟用。會導致莫名的 MDX 內容解析錯誤，從而無法正確 build
         */
        // mdxRs: true
        /**
         * 解決：You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.
         */
        externalDir: true
    },
    async redirects() {
        return redirects
    },
    async headers() {
        return [
            {
                source: '/:all*(woff2)',
                locale: false,
                headers: [
                    {
                        'key': 'Cache-Control',
                        'value': 'public, max-age=31536000'
                    }
                ],
            },
        ]
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com'
            },
            {
                protocol: 'https',
                hostname: 'images.opencollective.com'
            },
            {
                protocol: 'https',
                hostname: 'img.shields.io'
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com'
            }
        ],
    },
    modularizeImports: {
        '@tabler/icons-react': {
            transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
        }
    },
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    async rewrites() {
        return [
            {
                source: '/cdn/:path*',
                destination: 'https://cdn.jsdelivr.net/npm/@master/:path*',
            }
        ]
    },
    webpack: (config) => {
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    { from: './node_modules/monaco-editor/min/vs', to: path.resolve('public/monaco-editor/vs') }
                ],
            })
        )
        return withWebpackConfig(config)
    }
}

export default withBundleAnalyzer(withMDX(nextConfig), {
    enabled: process.env.ANALYZE === 'true',
})