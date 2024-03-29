import React from 'react'
import Posts from './Posts'
import LikedPosts from './LikedPosts'
import MiniProfile from './MiniProfile'
import Suggestions from './Suggestions'
import { useSession } from 'next-auth/react'

function Feed({ liked }) {
    const { data: session } = useSession();

    return (
        <main className={`px-1 md:px-10 grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${!session && '!grid-cols-1 !max-w-3xl'}`}>
            <section className='col-span-2 md:px-5'>
                {!liked ? (
                    <Posts />
                ) : (
                    <LikedPosts />
                )}
            </section>

            {session && (
                <section className='hidden xl:inline-grid md:col-span-1'>
                    <div className='fixed top-20'>
                        <MiniProfile />
                        <Suggestions />
                    </div>
                </section>
            )}

        </main>
    )
}

export default Feed