import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import Image from 'next/image';

function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => searchUsers(searchInput), 200);
        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    async function searchUsers(searchQuery) {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '>=', searchQuery), where('username', '<=', searchQuery + '\uf8ff'));
        const querySnapshot = await getDocs(q);

        const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setSearchResults(users);
    }

    return (
        <div className='max-w-xs'>
            <div className='relative mt-1 p-3 rounded-md'>
                <div className='absolute inset-y-0 pl-3 flex items-center pointer-events-none'>
                    <MagnifyingGlassIcon className='h-5 w-5 text-gray-500' />
                </div>
                <input
                    className='bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md'
                    type='text'
                    placeholder='Search'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    autoComplete='new-password'
                />
                <div className='absolute left-0 w-full mt-2 bg-white shadow-lg rounded-md'>
                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className='flex items-center p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                                setSearchInput('');
                                setSearchResults([]);
                                router.push(`/profile/${user.username}`);
                            }}
                        >
                            <Image
                                src={user.profileImg}
                                alt={user.username}
                                width={96} height={96}
                                className='h-8 w-8 rounded-full mr-2'
                            />
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;