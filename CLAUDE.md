# Publishing blog posts from Inkdrop drafts

Posts for this blog are drafted in Inkdrop before they land here. When asked
to turn an Inkdrop note into a post (e.g. "convert this into a blog-ready
entry"), follow this flow:

1. **Find the note.** Use the Inkdrop MCP tools (`search-notes` / `read-note`)
   to locate the draft and read its raw markdown + title.
2. **Pull its images out.** From this repo's root, run:

   ```sh
   inkdrop-note-export <noteId> --out src/content/posts/images/entry-N
   ```

   (`N` is the same post number used in step 3.) This is a standalone CLI
   (source: `~/personal/inkdrop-note-export`) that talks to Inkdrop's
   built-in Local Server. It writes each pasted image into that folder and
   also writes a `note.md` alongside them with `inkdrop://file:...` links
   rewritten to local relative paths — delete that `note.md` afterwards,
   it's just a rewriting aid, not the final post. Requires
   `INKDROP_LOCAL_SERVER_USERNAME`/`PASSWORD` env vars and the Inkdrop app
   running; see that project's README if the command fails.
3. **Write the post** at `src/content/posts/entry-N.md`, where `N` is one
   past the highest existing `entry-*.md`. Frontmatter schema
   (`src/content/config.ts`):

   ```yaml
   ---
   title: Entry [N]
   date: YYYY-MM-DD
   description: One or two sentences, punchy, matches the post's actual content.
   tags: [lowercase, kebab-case, technical, topics]
   draft: false
   heroImage: ./images/entry-N/<filename>   # optional, omit if there's no hero
   heroImageAlt: Alt text for the hero image # required if heroImage is set
   ---
   ```

   - `heroImage` and any inline body images go through Astro's `image()`
     schema helper / `astro:assets` pipeline (see `src/layouts/Post.astro`),
     so they must be relative paths resolving into
     `src/content/posts/images/entry-N/` — not `/img/...` absolute paths,
     and not the `public/` dir.
   - Reference inline images the same way, relative from the post file:
     `![alt text](./images/entry-N/<filename>)`. Always include real alt
     text (not the filename).
   - When referencing a prior post, link it as
     `https://stoykotolev.com/blog/entry-N/` (absolute, matches existing
     posts), not a relative path.
   - Match the voice/formatting of recent entries (e.g. `entry-10.md`,
     `entry-11.md`) rather than the Inkdrop draft's raw formatting verbatim —
     the note is source material, not a copy-paste target.
