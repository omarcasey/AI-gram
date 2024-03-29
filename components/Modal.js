import { modalState } from "../atoms/modalAtom"
import { useRecoilState } from "recoil"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef, useState } from "react"
import { CameraIcon } from "@heroicons/react/24/outline"
import { db, storage } from '../firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { ref, getDownloadURL, uploadString } from "firebase/storage"
import { Configuration, OpenAIApi } from "openai"
import Image from "next/image"

const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)


function Modal() {

    const { data: session } = useSession()
    const [open, setOpen] = useRecoilState(modalState)
    const promptRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [rendering, setRendering] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const generateImage = async () => {
        if (promptRef.current.value.trim().length == 0) {
            promptRef.current.value = ''
            return
        }
        console.log('openai image start')
        const prompt = promptRef.current.value
        setRendering(true)

        try {
            const response = await openai.createImage({
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: 'b64_json',
            })

            const imageBase64 = response.data.data[0].b64_json
            console.log('openai image generated')
            setRendering(false)
            setSelectedFile(imageBase64)

        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
            setRendering(false)
            setSelectedFile(null)
        }
    }

    const uploadPost = async () => {
        if (loading) return;
        setLoading(true);
        //create post and add to firestore posts collection
        //get post id for new post
        //upload image to firebase storage with post id
        //get a download url from firebase storage and update original post with image 

        const docRef = await addDoc(collection(db, 'posts'), {
            username: session.user.username,
            caption: promptRef.current.value,
            profileImg: session.user.image,
            timestamp: serverTimestamp(),
        })

        console.log("New post added with ID", docRef.id);

        try {

            const imageRef = ref(storage, `posts/${docRef.id}/image`)
            await uploadString(imageRef, selectedFile, 'base64', { contentType: 'image/png' }).then(async snapshot => {
                const downloadURL = await getDownloadURL(imageRef)
                await updateDoc(doc(db, 'posts', docRef.id), {
                    image: downloadURL
                })
            })

        } catch (error) {
            console.log(error.message)
        }

        setOpen(false)
        setLoading(false)
        setSelectedFile(null)
    }

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as='div' className='fixed z-10 inset-0 overflow-y-auto' onClose={() => setOpen(false)}>
                <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ' />
                    </Transition.Child>

                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden='true'>&#8203;</span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left 
                    overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                            {/* content here */}
                            <div>
                                {selectedFile ? (
                                    <Image width={1024} height={1024} src={`data:image/png;base64, ${selectedFile}`} className='w-full object-contain cursor-pointer' onClick={() => setSelectedFile(null)} alt='' />
                                ) : (
                                    <div onClick={() => generateImage()} className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'>
                                        <CameraIcon className="h-6 w-6 text-red-600" aria-hidden='true' />
                                    </div>
                                )}

                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        {rendering ? (
                                            <Dialog.Title as="h3" className='text-lg leading-6 font-medium text-gray-900'>
                                                Your image is being generated...
                                            </Dialog.Title>
                                        ) : (
                                            <Dialog.Title as="h3" className='text-lg leading-6 font-medium text-gray-900'>
                                                {selectedFile ? 'Upload this photo' : 'Enter Image Prompt'}
                                            </Dialog.Title>
                                        )}
                                        <div className="mt-2">
                                            {!rendering && (
                                                <input className="border-none focus:ring-0 w-full text-center" type='text' placeholder={selectedFile ? 'Please enter a caption...' : 'Put your imagination into words...'} ref={promptRef} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button type="button" onClick={uploadPost} disabled={!selectedFile} className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 
                                    py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300'>
                                        {loading ? 'Uploading...' : 'Upload Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog >
        </Transition >
    )
}

export default Modal