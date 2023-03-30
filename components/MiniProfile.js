import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router';

function MiniProfile() {
    const { data: session } = useSession()
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    
        // Redirect to the home page
        router.push('/');
    };

    return (
        <div className='flex items-center justify-between mt-14 ml-10'>
            <img className='rounded-full border p-[2px] w-16 h-16' src={session?.user?.image} alt='' />
            <div className='flex-1 mx-4'>
                <h2 className='font-bold'>{session?.user?.username}</h2>
                <h3 className='text-sm text-gray-400'>Welcome to Instagram</h3>
            </div>

            <button onClick={handleSignOut} className='text-blue-400 text-sm font-semibold'>Sign Out</button>
        </div>
    )
}

export default MiniProfile