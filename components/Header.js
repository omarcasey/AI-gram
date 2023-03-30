import React from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon, PlusCircleIcon, HeartIcon, Bars3Icon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid'
import { HomeIcon } from "@heroicons/react/24/solid"
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil"
import { modalState } from '../atoms/modalAtom'
import Search from './Search'

function Header({ liked }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [open, setOpen] = useRecoilState(modalState)

    return (
        <div className='shadow-sm border-b bg-white sticky top-0 z-50'>
            <div className='flex justify-between max-w-6xl mx-5 lg:mx-auto'>
                {/* Left */}
                <div onClick={() => router.push('/')} className="relative hidden lg:inline-grid w-32 cursor-pointer">
                    <Image
                        src='/aigram.png'
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div onClick={() => router.push('/')} className="relative w-10 lg:hidden flex-shrink-0 cursor-pointer">
                    <Image
                        src='https://links.papareact.com/jjm'
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                {/* Middle - search input field */}
                <Search />
                {/* Right */}
                <div className='flex items-center justify-end space-x-4'>
                    <HomeIcon onClick={() => router.push('/')} className='navBtn' />
                    <Bars3Icon className='h-6 md:hidden' />
                    {session ? (
                        <>
                            <PlusCircleIcon onClick={() => setOpen(true)} className='navBtn' />
                            {liked ? (
                                <HeartIconFilled className='navBtn fill-red-900' onClick={() => router.push('/')} />
                            ) : (
                                <HeartIcon className='navBtn' onClick={() => router.push('/likes')} />
                            )}
                            <img onClick={() => router.push(`/profile/${session.user.username}`)} src={session.user.image} alt='profile pic' className='h-10 w-10 rounded-full cursor-pointer' />
                        </>
                    ) : (
                        <button className='' onClick={signIn}>Sign In</button>
                    )}

                </div>

            </div>

        </div>
    )
}

export default Header