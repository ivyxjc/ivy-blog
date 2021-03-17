import { Feed } from 'feed'
import { Post } from '../pages/index'
import { formatSlug } from './slugFormat'

const domain = 'https://blog.ivyxjc.com'

export const generateRss = (posts: Post[]) => {
  const year = new Date().getFullYear()
  const feed = new Feed({
    id: domain,
    link: domain,
    title: "Ivyxjc's Blog",
    copyright: `All rights reserved ${year}, Ivyxjc`,
    image: `${domain}/favicon.png`,
    favicon: `${domain}/favicon.ico`,
    author: {
      name: 'Ivyxjc',
      email: 'ivyxjc1994@hotmail.com',
      link: 'https://ivyxjc.com'
    }
  })

  posts.forEach(post => {
    if (post.published) {
      feed.addItem({
        title: post.title,
        id: `${domain}${formatSlug(post.date, post.slug)}`,
        link: `${domain}${formatSlug(post.date, post.slug)}`,
        description: post.preview,
        date: new Date(post.date)
      })
    }
  })

  return feed.rss2()
}
