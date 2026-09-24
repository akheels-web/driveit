import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import config from '@/payload.config'

// Every method Payload serves must be exported here. A missing one does not fall
// back to Payload — Next answers 405 and the whole feature disappears silently.
// PATCH in particular is how documents are updated over REST (the admin panel's
// inline actions, bulk edits and any external integration).
export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
