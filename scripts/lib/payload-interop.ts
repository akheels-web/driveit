/**
 * Node/tsx interop shim for scripts that talk to Payload directly.
 *
 * Why this is needed
 * ------------------
 * Payload's ESM entry (`payload/dist/exports/node.js`) reaches its env helper
 * (`payload/dist/bin/loadEnv.js`) through Node's CJS `require`. When the script
 * runs under `tsx`, that file is transpiled to CommonJS, so its
 *
 *   import nextEnvImport from '@next/env'
 *   const { loadEnvConfig } = nextEnvImport
 *
 * becomes `require('@next/env').default.loadEnvConfig`. `@next/env` is a bundled
 * CommonJS module that sets `__esModule: true` and exports *named* members only,
 * so `.default` is `undefined` and the require throws:
 *
 *   TypeError: Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is undefined.
 *
 * Patching the module object after the fact is not enough (tsx hands ESM
 * importers a separate namespace copy), so this shims the CJS loader itself:
 * every `require('@next/env')` gets a module whose `default` points at itself —
 * which is exactly what a real ESM `import x from '@next/env'` would produce
 * under plain Node.
 *
 * Import this *before* `payload` in any tsx-run script. It is a no-op outside
 * tsx (Node's own loader already exposes the correct shape).
 */
import Module from 'node:module'

type CjsLoader = { _load: (request: string, parent: unknown, isMain: boolean) => any }

const loader = Module as unknown as CjsLoader

if (typeof loader._load === 'function') {
  const originalLoad = loader._load

  loader._load = function patchedLoad(request: string, parent: unknown, isMain: boolean) {
    const loaded = originalLoad.call(this, request, parent, isMain)

    if (request === '@next/env' && loaded && typeof loaded === 'object' && !('default' in loaded)) {
      loaded.default = loaded
    }

    return loaded
  }
}
