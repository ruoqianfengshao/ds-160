// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  routeRules: {
    '/': { prerender: true },
    '/features': { prerender: true },
    '/pricing': { prerender: true },
    '/app/**': { ssr: false }
  },
  
  app: {
    head: {
      title: 'DS-160 Helper - 美国签证申请表辅助填写工具',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'DS-160 Helper - 美国签证申请表辅助填写工具，提供12步引导式填写、草稿自动保存、高风险字段警示' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap' }
      ]
    }
  },
  
  css: ['~/assets/css/main.css'],
})
