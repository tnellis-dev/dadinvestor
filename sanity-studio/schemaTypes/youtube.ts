import {defineType, defineField} from 'sanity'

export const youtube = defineType({
  name: 'youtube',
  title: 'YouTube Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'url',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'YouTube Video',
        subtitle,
      }
    },
  },
})




defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    {type: 'block'},
    {type: 'image'},
    {type: 'youtube'},
  ],
})


