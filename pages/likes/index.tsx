import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../components/Header'
import Feed from '../../components/Feed'
import Modal from '../../components/Modal'

const Likes: NextPage = () => {
  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>Instagram AI Clone</title>
        <link rel="icon" href="/insta-favicon.png" />
      </Head>
      <Header liked={true} />
      <Feed liked={true} />
      <Modal />
    </div>
  )
}

export default Likes
