import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * Flat ESLint config (Next.js removed the `next lint` command in v16, so the
 * `lint` script calls ESLint directly).
 */
export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'payload-types.ts',
      'public/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // The marketing pages intentionally use <img> for CMS-provided URLs and
      // data URLs in a few places; surface it as a warning rather than an error.
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // React 19 no longer needs the classic runtime import in scope.
      'react/react-in-jsx-scope': 'off',
      // Long-form marketing copy contains apostrophes. Escaping them as
      // &apos; makes the copy unreadable in the source for no user-visible gain
      // (JSX already renders them correctly).
      'react/no-unescaped-entities': 'off',
    },
  },
]
