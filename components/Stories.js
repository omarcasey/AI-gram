import React, { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import Story from './Story'
import { useSession } from 'next-auth/react'

function Stories() {
    const [suggestions, setSuggestions] = useState([])
    useEffect(() => {
        const suggestions = [...Array(20)].map((_, i) => ({
            userId: i,
            username: faker.internet.userName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            password: faker.internet.password(),
            birthdate: faker.date.birthdate(),
            registeredAt: faker.date.past(),
        }))
        setSuggestions(suggestions);
    }, [])

    const { data: session } = useSession()

    return (

        <div className='flex space-x-2 p-6 bg-white mt-8 border border-gray-200 rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black'>
            {session && (
                <Story key={session?.user?.uid}
                    img={session?.user?.image}
                    username={session?.user?.username} />
            )}
            {suggestions.map(profile => (
                <Story key={profile.userId}
                    img={profile.avatar}
                    username={profile.username} />
            ))}
        </div>
    )
}

export default Stories