/** @type {import('@inkdrop/live-export').Config} */
module.exports = {
  pathForNote({ note, tags }) {
    // Only export notes flagged with public: true in their frontmatter
    if (!note.docProps?.public) return undefined
    const slug =
      note.docProps?.slug ||
      note.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    return `src/content/posts/${slug}.md`
  },

  urlForNote({ note }) {
    const slug =
      note.docProps?.slug ||
      note.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    return `/blog/${slug}`
  },

  frontmatterForNote({ note, tags }) {
    return {
      title: note.title,
      description: note.docProps?.description || '',
      date: new Date(note.createdAt).toISOString().split('T')[0],
      tags: tags.map(t => t.name),
      draft: note.docProps?.draft ?? false,
    }
  },
}
