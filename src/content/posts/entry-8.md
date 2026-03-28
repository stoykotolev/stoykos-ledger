---
title: Entry [8]
date: 2026-03-28
description: Rebuilding this blog, making it more up-to-date and looking slicker than ever ;)
tags: [blog, nextjs, astro, vercel, cloudflare]
draft: false
---

In the [last entry](https://stoykotolev.com/blog/entry-7/) this blog was restarted. And seeing as the tech used for it was quite dated, I think it's time to also freshen it up a bit.

The starting point is this:

- Nextjs v13 with the pages router
- SCSS modules
- Entries in a full markdown file that are then built as a static website.
- Hosted on Vercel

I've been getting warnings about almost every single package from this repository for years now. And I have 2 options at the moment:

- Rework the existing implementation
- Greenfield project

And well. I'm a programmer, heh..

## The restart

I did some reading, some looking, some talking with Claude and here's what happened.

### Tanstack Start

First, I thought about using [Tanstack Start](https://tanstack.com/start/latest). It's new, shiny, from an organization that has a record of building amazing libraries and we use it at work. So it would've helped me get some experience with it.

But it doesn't make much sense for a blog. Yeah, I can set it up to be a static website with all the bells and whistles, it just feels too much.

So, off to the next challenger.

### Astro

I've been hearing a lot about it, for a while now. _It's amazing_, _it's perfect for static sites_, _it has islands if you need dynamic content_, etc.

And well, uh, we are building a **blog** after all.

So, after a bit more reading, finding out that they are now officially sponsored by Cloudflare, which offers hosting Astro websites on their platform for free, and mulling it over for some time, here it is.

## The plan

Now the plan is simple:

Make A Blog. But better.

The stack remains fairly simple:

- Astro for rendering and pages.
- Tailwind for CSS, because honestly fuck managing the CSS by hand.
- Markdown for the blog posts themselves.
- And some packages for fancy addons.

## Building the website

I did some reading on Astro, how it works, what it does, just so I can get some basic understanding of it. And then we went to work. And by we, I mean me and Claude. I've wanted to try out the fancy new AI tool in town. So I played the role of a Product Manager, but with the technical knowledge on when it suggests something stupid, so I can shepherd it back on track.

The requirements were simple:

- Home page with a list of all blog items.
- Tags, for convenience
- Search functionality, for when the time comes where there are a lot of posts on the website (hah)
- Dark/Light themes, cuz I hate light themes, but there are freaks out there.
- Code blocks with syntax highlighting
- And get this - read times for each article. I've always _loved_ that in other blogs, so it's **our** idea now.
- An RSS feed, because I know I want to get into that part of the internet, but I haven't yet. So yeah, that's available as well.

And off it went, kinda one shotting the requirements for everything. Yes, the blog's design doesn't have some vibrant personality nor does it feel very personal to me. But I've never been one that has a very artistic personality with colors, fonts, etc. It's more so autistic with a touch of Gen Z humour.

So, it works, it shows what needs to be shown and is easy to maintain, which imo is a great plus, opposed to what I had to deal with the old code.

It looks _fine_-ish imo and it almost got a 100 on Lighthouse from the get go.

So, what did it miss.

Background colors and robots.txt. Easy enough.

## Fixing the small stuff.

As already established, the colors of the blog don't matter much to me. As long as it looks good when I look at it and passes the checks. So I tasked Claude with fixing them and then went on to create the robots.txt file myself. It's still an important part of the internet, at least for me, even though some people think it doesn't matter. So I tuned it a bit and this is what I ended up with:

```text
User-agent: *
Disallow: /search
Disallow: /rss.xml
```

There is no point crawling the search or RSS feed pages. So block it there, to feel good about myself and let's see how it goes.

Looking at the home page a bit more, I decided I don't like how it's just a list:
Thinking about it, I wanted it to be compact and with a bit more _life_ in it. After some back and forth with Claude and looking for inspiration elsewhere, the new look I think looks better. Not just fine.
I also wanted to add a bit more info about myself with links to where people can find me. So I updated the introduction of the blog, to not only include some of my socials, but better present me to the reader, or whoever ended up on my website.

And here it is. You are already here, so you've seen all the changes, but there will be more to come, I hope. The goal, after all, is to have the freedom to experiment here, as my personal playground.
