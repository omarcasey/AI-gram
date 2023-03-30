import React, { useEffect, useState } from 'react'
import { BookmarkIcon, ChatBubbleOvalLeftIcon, EllipsisHorizontalIcon, FaceSmileIcon, HeartIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Moment from 'react-moment'
import Link from 'next/link';


function Post({ id, username, userImg, img, caption, timestamp }) {
    const { data: session } = useSession();
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState([])
    const [hasLiked, setHasLiked] = useState(false)

    useEffect(() => onSnapshot(query(collection(db, 'posts', id, 'comments'), orderBy('timestamp', 'desc')),
        snapshot => setComments(snapshot.docs)), [db, id]
    );

    useEffect(() => onSnapshot(collection(db, 'posts', id, 'likes'),
        snapshot => setLikes(snapshot.docs)), [db, id]
    );

    useEffect(() => setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1), [likes]
    );

    const likePost = async () => {
        if (hasLiked) {
            await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
        } else {
            await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
                username: session.user.username,
            })
        }
    }

    const sendComment = async (e) => {
        e.preventDefault()
        const commentToSend = comment;
        setComment('');

        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            username: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp(),
        })
    }

    return (
        <div className='bg-white my-7 border rounded-sm'>
            {/* HEADER */}
            <div className='flex items-center p-5'>
                <Link className='flex items-center flex-1' href={`/profile/${username}`}>
                    <img className='rounded-full h-12 w-12 object-contain border p-1 mr-3' src={userImg} alt='' />
                    <p className='font-bold'>{username}</p>
                </Link>
                <EllipsisHorizontalIcon className='h-5' />
            </div>

            {/* img */}
            <img src={img} className='object-cover w-full' alt='' />

            {/* BUTTONS */}
            {session && (
                <div className='flex justify-between px-4 pt-4'>
                    <div className='flex space-x-4'>
                        {hasLiked ? (
                            <HeartIconFilled onClick={likePost} className='btn fill-red-500' />
                        ) : (
                            <HeartIcon onClick={likePost} className='btn' />
                        )}
                        <ChatBubbleOvalLeftIcon className='btn' />
                        <PaperAirplaneIcon className='btn' />
                    </div>
                    <BookmarkIcon className='btn' />
                </div>
            )}


            {/* caption */}
            <p className='p-5 truncate'>
                {likes.length > 0 && (
                    <p className='font-bold mb-1'>{likes.length} {likes.length == 1 ? ('like') : ('likes')}</p>
                )}
                <span className='font-bold mr-2'>{username}</span>
                {caption}
            </p>

            {/* comments */}
            {comments.length > 0 && (
                <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                    {comments.map(comment => (
                        <div key={comment.id} className='flex items-center space-x-2 mb-3'>
                            <img src={comment.data().userImage} alt='' className='h-7 rounded-full' />
                            <p className='text-sm flex-1'><span className='font-bold mr-1'>{comment.data().username}</span>{comment.data().comment}</p>
                            <Moment className='pr-5 text-xs' fromNow>{comment.data().timestamp?.toDate()}</Moment>
                        </div>
                    ))}
                </div>
            )}

            {/* timestamp */}
            <div className='pb-5'>
                <Moment className='pl-5 text-xs' fromNow>{timestamp?.toDate()}</Moment>
            </div>

            {/* input box */}
            {session && (
                <form className='flex items-center p-4'>
                    <FaceSmileIcon className='h-7' />
                    <input className='border-none flex-1 focus:ring-0 outline-none' value={comment} onChange={(e) => setComment(e.target.value)} type='text' placeholder='Add a comment...' />
                    <button type='submit' disabled={!comment.trim()} onClick={sendComment} className='font-semibold text-blue-400'>Post</button>
                </form>
            )}

        </div>
    )
}

export default Post