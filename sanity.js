import { createClient } from 'next-sanity'

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: '2021-03-25',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
}

export const sanityClient = createClient(config)