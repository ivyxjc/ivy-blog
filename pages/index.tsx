import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'

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

export interface PostView {
  key: string
  value: number
}

export const getAllPosts = async (): Promise<Post[]> => {
  return await axios.get(`https://notion-api.splitbee.io/v1/table/${NOTION_BLOG_ID}`).then(res => res.data)
}

export const getPostViews = async (): Promise<PostView[]> => {
  const today = new Date()
  const aYearBefore = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

  // console.log(today.toISOString())
  // console.log(aYearBefore.toISOString())

  return await axios
    .post(
      'https://api.splitbee.io/graphql',
      {
        query: `query getTopPages($range: TimeRangeInput!, $filter: StatsFilter) {
        topPages(range: $range, filter: $filter) {
          key
          value
          __typename
        }
      }`,
        operationName: 'getTopPages',
        variables: {
          range: {
            from: aYearBefore.toISOString(),
            to: today.toISOString()
          },
          filter: {}
        }
      },
      {
        headers: {
          projectId: 'blog.ivyxjc.com',
          'content-type': 'application/json'
        }
      }
    )
    .then(res => res.data.data.topPages)
}

export const getStaticProps = async () => {
  // const postViews = new Map<string, number>()

  // const postViewList = await getPostViews()
  // postViewList.forEach((v: PostView) => {
  //   postViews.set(v.key, v.value)
  // })

  const posts = (await getAllPosts()).filter(p => p.published)
  posts.forEach(p => {
    p.views = 0
  })

  return {
    props: {
      posts
    },
    revalidate: 1
  }
}

const HomePage = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <Head>
        <title>Ivyxjc&apos;s Blog</title>
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 justify-center flex-grow max-w-3xl">
          <Navbar />

          <div className="my-20">
            <div className="inline-block shadow-lg rounded-full w-18 h-18">
              <Image className="rounded-full" src="/images/avatar.png" alt="avatar" width="100%" height="100%" />
            </div>
            <div className="mt-8 text-2xl font-bold">Ivyxjc&apos;s Blog</div>

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
