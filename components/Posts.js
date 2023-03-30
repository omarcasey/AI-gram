import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Post from './Post'
import { db } from '../firebase'

function Posts({ user }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let queryRef;
    if (user) {
      queryRef = query(collection(db, 'posts'), where('username', '==', user), orderBy('timestamp', 'desc'));
    } else {
      queryRef = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    }
    return onSnapshot(queryRef, (snapshot) => {
      setPosts(snapshot.docs);
    });
  }, [db, user]);
  

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImg}
          img={post.data().image}
          caption={post.data().caption}
          timestamp={post.data().timestamp}
        />
      ))}
    </div>
  )
}

export default Posts