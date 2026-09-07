import { defineType, defineField } from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Articles & Guides',
  type: 'document',

  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'The short introduction displayed underneath the article title.',
      type: 'text',
      rows: 3,
      group: 'content',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'ETFs & Investing', value: 'ETFs & Investing' },
          { title: 'Banking & Savings', value: 'Banking & Savings' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
      initialValue: 'DadInvestor Team',
    }),

    defineField({
      name: 'updatedDate',
      title: 'Updated Date',
      type: 'date',
      group: 'content',
    }),

    defineField({
      name: 'readTimeMinutes',
      title: 'Read Time (minutes)',
      description: 'Enter the estimated reading time as a number, e.g. 8.',
      type: 'number',
      group: 'content',
      validation: (Rule) => Rule.integer().positive(),
    }),

    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      description: 'Optional bullet points displayed near the beginning of the article.',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    }),

    defineField({
      name: 'body',
      title: 'Article Body',
      description: 'The main article content.',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),

    defineField({
      name: 'disclaimer',
      title: 'Disclaimer',
      description: 'Disclaimer displayed at the end of the article.',
      type: 'text',
      rows: 5,
      group: 'content',
      initialValue:
        'The information provided on DadInvestor.com.au is for general educational and informational purposes only. It does not constitute formal financial, tax, or legal advice.',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt Text',
      description: 'Describe the image for accessibility and SEO.',
      type: 'string',
      group: 'media',
    }),

    defineField({
      name: 'featured',
      title: 'Featured Article',
      description: 'Show this article as the featured article on the articles page.',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
  ],
})

export const schemaTypes = [articleType]