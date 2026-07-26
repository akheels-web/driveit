import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@/payload.config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args) =>
  generatePageMetadata({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
  })

const NotFound = async ({ params, searchParams }: Args) =>
  NotFoundPage({
    config: configPromise,
    params: await params,
    searchParams: await searchParams,
    importMap,
  })

export default NotFound
