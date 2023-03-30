import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Image from 'next/image';

function Suggestions() {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState([]);

    const handleFollowClick = (username) => {
        router.push(`/profile/${username}`);
      };

    const getRandomIndex = async (collectionSize, limit) => {
        const randomIndex = Math.floor(Math.random() * (collectionSize - limit));
        const usersRef = collection(db, 'users');
        const randomUserSnapshot = await getDocs(query(usersRef, orderBy('createdAt'), startAt(randomIndex), limit(1)));
        return randomUserSnapshot.docs[0];
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const totalUsers = usersSnapshot.size;

            setSuggestions(usersSnapshot.docs.map((doc) => ({ ...doc.data(), userId: doc.id })));

            // if (totalUsers <= 5) {
            //     setSuggestions(usersSnapshot.docs.map((doc) => ({ ...doc.data(), userId: doc.id })));
            // } else {
            //     const randomStartDoc = await getRandomIndex(totalUsers, 5);
            //     const userQuery = query(usersRef, orderBy('createdAt'), startAt(randomStartDoc), limit(5));
            //     const randomUsersSnapshot = await getDocs(userQuery);
            //     setSuggestions(randomUsersSnapshot.docs.map((doc) => ({ ...doc.data(), userId: doc.id })));
            // }
        };

        fetchSuggestions();
    }, []);

    return (
        <div className="mt-4 ml-10">
            <div className="flex justify-between text-sm mb-5">
                <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
                <button className="text-gray-600 font-semibold">See All</button>
            </div>
            {suggestions.map((profile) => (
                <div key={profile.userId} className="flex items-center justify-between mt-3">
                    <Image width={96} height={96} className="w-10 h-10 rounded-full border p-[2px]" src={profile.profileImg} alt="" />
                    <div className="flex-1 ml-4">
                        <h2 className="font-semibold text-sm">{profile.username}</h2>
                        <h3 className="text-xs text-gray-400">{profile.bio ? profile.bio : "Recently Joined AI-Gram"}</h3>
                    </div>
                    <button className="text-blue-400 text-sm font-bold" onClick={() => handleFollowClick(profile.username)}>Follow</button>
                </div>
            ))}
        </div>
    );
}

export default Suggestions;