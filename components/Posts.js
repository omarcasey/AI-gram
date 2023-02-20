import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import Post from './Post'
import { db } from '../firebase'

function Posts() {
  const tempUser = 'omarcasey'
  const [posts, setPosts] = useState([])

  useEffect(() => {
    return onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
      setPosts(snapshot.docs)
    });
  }, [db])

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

      {/* {posts.map((post) => {
        if (post.data().username == tempUser) {
          <Post key={post.id}
            id={post.id}
            username={post.data().username}
            userImg={post.data().profileImg}
            img={post.data().image}
            caption={post.data().caption}
            timestamp={post.data().timestamp}
          />
        }
      })} */}
    </div>
  )
}

export default Posts