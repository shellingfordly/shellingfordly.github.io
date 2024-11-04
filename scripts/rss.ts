import type { FeedOptions, Item } from 'feed'
import { dirname } from 'node:path'
import fg from 'fast-glob'
import { Feed } from 'feed'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const DOMAIN = 'https://shellingfordly.github.io'
const AUTHOR = {
  name: 'Shellingfordly',
  email: 'shellingfordly@qq.com',
  link: DOMAIN,
}
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

async function run() {
  await buildBlogRSS()
}

async function buildBlogRSS() {
  const files = await fg('pages/blog/**/*.md')

  const options = {
    title: 'Shellingfordly',
    description: 'Shellingfordly\' Blog',
    id: 'https://shellingfordly.github.io/',
    link: 'https://shellingfordly.github.io/',
    favicon: 'https://shellingfordly.github.io/images/icons/favicon.svg',
    copyright: 'Copyright © 2023 shellingfordly',
    author: AUTHOR,
    feedLinks: {
      json: 'https://shellingfordly.github.io/feed.json',
      atom: 'https://shellingfordly.github.io/feed.atom',
      rss: 'https://shellingfordly.github.io/feed.xml',
    },
  }
  const posts: any[] = (
    await Promise.all(
      files.flat().filter(i => !i.endsWith('/blog/index.md'))
        .map(async (i) => {
          console.log(i)
          const raw = await fs.readFile(i, 'utf-8')
          const { data, content } = matter(raw)

          // 检查数据
          if (!data.title || !data.date || !data.tags) {
            console.log('Error data for:', i)
            return
          }

          // 检查内容
          if (!content.trim()) {
            console.log('Empty content for:', i)
            return
          }

          const html = markdown.render(content)
            .replace('src="/', `src="${DOMAIN}/`)

          // 检查html
          if (!html) {
            console.log('Failed to render HTML for:', i)
            return
          }

          if (data.image?.startsWith('/'))
            data.image = DOMAIN + data.image

          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: DOMAIN + i.replace(/^pages(.+)\.md$/, '$1'),
          }
        }),
    ))
    .filter(Boolean)

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))

  await writeFeed('feed', options, posts)
}

async function writeFeed(name: string, options: FeedOptions, items: Item[]) {
  options.author = AUTHOR

  const feed = new Feed(options)

  items.forEach(item => feed.addItem(item))

  await fs.ensureDir(dirname(`./dist/${name}`))
  await fs.writeFile(`./dist/${name}.xml`, feed.rss2(), 'utf-8')
  await fs.writeFile(`./dist/${name}.atom`, feed.atom1(), 'utf-8')
  await fs.writeFile(`./dist/${name}.json`, feed.json1(), 'utf-8')
}

run()