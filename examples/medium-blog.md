# Plan: Personal Blog

## What I want to build
A blog where I can write posts in Markdown and publish them. Readers can browse a list of posts and read individual posts. Maybe RSS later.

## Stack
- Probably Next.js because it's popular and good at this.
- Posts stored as `.md` files in a folder, parsed at build time.
- Hosted somewhere — probably Vercel since it's free for personal stuff.

## Scope
- Just me writing posts. A handful of readers — friends, mostly.
- A homepage listing posts by date, an individual post page, an about page.
- Dark mode would be nice.

## What I haven't figured out
- Whether to use MDX or plain Markdown. MDX lets me embed React components but I'm not sure if I'll need that.
- Comments. Maybe Giscus. Maybe nothing.
- Analytics. Maybe Plausible. Maybe nothing.
- How images work — do I drop them in `public/` or import them? Not sure which Next.js prefers.
- SEO. I know it matters but I haven't read about it.

## Risk
- Honestly probably none, this is a personal blog. The worst case is I waste a weekend.

## Success criteria
- I can write a post and have it appear on the site after pushing to GitHub.
- It looks reasonably nice on desktop. Mobile too if it's not much extra work.
