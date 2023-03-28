export default {
  "*.{js,cjs,mjs,ts,tsx}": [
    "eslint --fix",
    "prettier --write",
  ],
  "*.{ts,tsx}": () => "pnpm run type-check",
}
