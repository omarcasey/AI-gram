import { doc, getDocs, collectionGroup, query, where, getDoc, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Post from './Post';
import { db } from '../firebase';
import { useSession } from 'next-auth/react'

function LikedPosts() {
    const [posts, setPosts] = useState([])
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchLikedPosts() {

            // Step 1: Get all postIds liked by the user
            const likedPostIds = [];
            const allLikes = query(collectionGroup(db, 'likes'), where('username', '==', session.user.username));
            const querySnapshot = await getDocs(allLikes);
            querySnapshot.forEach((doc) => {
                likedPostIds.push(doc.ref.parent.parent.id);
            });

            // Step 2: Fetch post details for each liked post
            const postPromises = likedPostIds.map(async (postId) => {
                const postRef = doc(db, 'posts', postId);
                const postData = await getDoc(postRef);
                return postData;
            });

            console.log(postPromises)

            const postSnapshots = await Promise.all(postPromises);
            console.log(postSnapshots)
            const likedPosts = postSnapshots.map((post) => ({
                id: post.id,
                ...post.data(),
            }));
            console.log(likedPosts)

            // Sort the posts by timestamp in chronological order
            likedPosts.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

            setPosts(likedPosts);
        }

        fetchLikedPosts();

    }, [db]);


    return (
        <div>
            {posts?.map((post) => (
                <Post
                    key={post.id}
                    id={post.id}
                    username={post.username}
                    userImg={post.profileImg}
                    img={post.image}
                    caption={post.caption}
                    timestamp={post.timestamp}
                />
            ))}
        </div>
    )
}

export default LikedPosts;