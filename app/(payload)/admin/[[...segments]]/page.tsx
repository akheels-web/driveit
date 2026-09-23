import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@/payload.config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

// Payload's views await `params`/`searchParams` internally — pass the promises
// through instead of awaiting them here.
export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({
    config: configPromise,
    params,
    searchParams,
  })

const Page = ({ params, searchParams }: Args) =>
  RootPage({
    config: configPromise,
    params,
    searchParams,
    importMap,
  })

export default Page
