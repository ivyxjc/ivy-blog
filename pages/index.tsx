import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import { formatSlug } from '../utils/slugFormat'

const NOTION_BLOG_ID = process.env.NOTION_BLOG_ID || 'b6f6795d7f0541cc913956c67315cbad'

export interface Author {
  id: string
  firstName: string
  lastName: string
  fullName: string
  profilePhoto: string
}

export interface Post {
  id: string
  title: string
  tag: string
  published: boolean
  date: string
  slug: string
  author: Author[]
  preview: string
  views: number
}

export const getAllPosts = async (): Promise<Post[]> => {
  return await axios.get(`https://notion-api.splitbee.io/v1/table/${NOTION_BLOG_ID}`).then(res => res.data)
}

export const getPostView = async (_: string): Promise<number> => {
  return Promise.resolve(41)
}

export const getStaticProps = async () => {
  const posts = (await getAllPosts()).filter(p => p.published)
  await Promise.all(
    posts.map(async p => {
      p.views = await getPostView(formatSlug(p.date, p.slug))
    })
  )

  return {
    props: {
      posts
    },
    revalidate: 60
  }
}

const HomePage = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <Head>
        <title>Ivyxjc&apos;s Blog</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto max-w-3xl">
          <Navbar />
        </div>

        <div className="container mx-auto mb-6 md:my-6 px-4 sm:px-6 justify-center flex-grow max-w-3xl bg-base-200 rounded">
          <div className="my-8">
            <img
              className="w-24 h-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2"
              src="/images/avatar.png"
              alt="avatar"
            />
            <div className="mt-8 text-2xl font-bold">Spencer&apos;s Blog</div>
            <div className="mt-2 text-neutral">
              Check out{' '}
              <Link href="/friends">
                <a className="link text-primary">Friends & Guestbook</a>
              </Link>{' '}
              if you want to drop by and say hello!
            </div>

            <div className="mt-12 leading-loose flex flex-col space-y-4">
              {posts.map(post => post.published && <PostCard key={post.id} post={post} />)}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default HomePage
