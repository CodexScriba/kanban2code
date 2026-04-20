# Testing Strategy

## Current Checks

- `npm run typecheck` validates TypeScript without emitting files.
- `npm run build` runs the esbuild bundle and asset-copy pipeline.
- `npm run test:docs` validates architecture/design index references.

## Docs Index Validation

`tests/docs-index.test.mjs` checks:

- architecture and design JSON parse correctly
- indexed topic files exist
- architecture sections include title, file, summary, and search terms
- UI component source/target paths exist for active components
- notes docs exist
- build scaffold copies are produced after `npm run build`
