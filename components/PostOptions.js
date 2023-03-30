import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Menu } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

async function deletePost(postId) {
    try {
        // Get a reference to the post document
        const postRef = doc(db, 'posts', postId);

        // Delete the post document
        await deleteDoc(postRef);

        console.log('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

async function updateCaption(postId, newCaption) {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { caption: newCaption });
}


export default function PostOptions({ postid, initial_caption }) {
    const [showModal, setShowModal] = useState(false);
    const [caption, setCaption] = useState(initial_caption);

    const closeModal = () => {
        setShowModal(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateCaption(postid, caption);
        closeModal();
    };

    return (
        <>
            {showModal && (
                <Transition appear show={showModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        onClose={closeModal}
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Edit Post Caption
                                    </Dialog.Title>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4">
                                            <label htmlFor="caption" className="block text-sm">
                                                Caption
                                            </label>
                                            <input
                                                type="text"
                                                id="caption"
                                                value={caption}
                                                onChange={(e) => setCaption(e.target.value)}
                                                className="w-full mt-1 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                type="submit"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                                            >
                                                Update Caption
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="ml-4 inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-transparent rounded-md hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            )}

            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button>
                        <EllipsisHorizontalIcon className="h-5" />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={openModal}
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block w-full text-left px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deletePost(postid);
                                        }}
                                    >
                                        Delete
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </>
    );
}