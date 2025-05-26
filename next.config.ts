import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        // env variables to use in client
        coffeLinkLow: process.env.coffeLinkLow,
        coffeLinkMedium: process.env.coffeLinkMedium,
        coffeLinkHigh: process.env.coffeLinkHigh,
        coffeLinkCustom: process.env.coffeLinkCustom,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },

    productionBrowserSourceMaps: true,
}

export default nextConfig
