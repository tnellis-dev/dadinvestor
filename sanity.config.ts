import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

export default defineConfig({
  name: 'dadinvestor-studio',
  title: 'DadInvestor Studio',
  
  projectId: 'ig18nrb8', // Your Sanity Project ID
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: [
      {
        name: 'post',
        title: 'Articles & Guides',
        type: 'document',
        fields: [
          { name: 'title', title: 'Article Title', type: 'string' },
          { name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' } },
          { name: 'body', title: 'Article Content', type: 'array', of: [{ type: 'block' }] }
        ]
      },
      {
        name: 'category',
        title: 'Categories',
        type: 'document',
        fields: [
          { name: 'title', title: 'Category Title', type: 'string' },
          { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }
        ]
      }
    ],
  },
})