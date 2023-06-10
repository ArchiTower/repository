import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@architower/repository",
  description: "Repository Pattern implementation in TypeScript for framework agnostic usage.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting started', link: '/getting-started' },
      { text: 'API', link: '/api/' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/architower/repository' }
    ]
  }
})
