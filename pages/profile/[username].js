import { useRouter } from 'next/router';

import Head from 'next/head'
import Header from '../../components/Header'
import ProfileView from '../../components/ProfileView'
import Modal from '../../components/Modal'

function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>{username}'s Profile</title>
        <link rel="icon" href="/insta-favicon.png" />
      </Head>
      <Header />
      <ProfileView user={username} />
      <Modal />
    </div>
  );
}

export default ProfilePage;