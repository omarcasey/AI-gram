import React, { useEffect, useState } from 'react';
import Posts from './Posts';
import { useSession } from 'next-auth/react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';

function ProfileView({ user }) {
  const { data: session } = useSession();
  const [numPosts, setNumPosts] = useState(0);
  const [numLikes, setNumLikes] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!user) return;

    const getData = async () => {
      const queryRef = query(collection(db, 'posts'), where('username', '==', user));
      const querySnapshot = await getDocs(queryRef);
      setNumPosts(querySnapshot.size);
      let likesPromises = [];
      querySnapshot.forEach((doc) => {
        const likesRef = collection(db, 'posts', doc.id, 'likes');
        likesPromises.push(getDocs(likesRef));
      });
      const likesSnapshots = await Promise.all(likesPromises);
      let totalLikes = 0;
      likesSnapshots.forEach((likesSnapshot) => {
        totalLikes += likesSnapshot.docs.length;
      });
      setNumLikes(totalLikes);
    };

    const fetchUserProfile = async () => {
      const userQueryRef = query(collection(db, 'users'), where('username', '==', user));
      const userQuerySnapshot = await getDocs(userQueryRef);
      const userDoc = userQuerySnapshot.docs[0];
      setUserProfile(userDoc.data());
    };

    getData();
    fetchUserProfile();
  }, [user, db]);

  return (
    <div>
      <div className='pt-5 mx-auto px-20 flex flex-row justify-center items-center gap-10'>
        <Image width={150} height={150} src={userProfile?.profileImg} className="h-[150px] w-[150px] rounded-full" />
        <div className='flex flex-col'>
          <p className='tracking-wider text-xl font-semibold pb-1'>{user}</p>
          <p className='text-gray-700 pb-5'>{userProfile?.bio}</p>
          <p><span className='font-bold'>{numPosts}</span> posts</p>
          <p><span className='font-bold'>{numLikes}</span> total likes</p>
        </div>
      </div>
      <main className={'md:max-w-3xl mx-auto'}>
        <section className='col-span-2'>
          {/* <Stories /> */}
          <Posts user={user} />
        </section>
      </main>
    </div>
  );
}

export default ProfileView;