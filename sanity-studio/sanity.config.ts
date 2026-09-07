import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'dadinvestor-studio',
  title: 'DadInvestor Studio',

  projectId: 'ig18nrb8',
  dataset: 'production',

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})