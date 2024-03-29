import { getProviders, signIn as signInto } from 'next-auth/react'
import Image from 'next/image';
import Header from '../../components/Header'

// Browser
function signIn({ providers }) {
    return (
        <>
            <Header />
            <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center'>
                <Image width={1700} height={350} className='w-80' src='/aigram.png' alt=''/>
                <p className='font-xs italic'>This app was built for educational purposes</p>
                <div className='mt-40'>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            <button className='p-3 bg-blue-500 rounded-lg text-white' onClick={() => signInto(provider.id, { callbackUrl: '/'})}>
                                Sign in with {provider.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </>
    )
}

//Server side render
export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}

export default signIn