import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async signIn(session) {
      const uid = session.user.id;
      const username = session.user.name.split(' ').join('').toLocaleLowerCase();
      const profileImg = session.user.image;

      await createUser(uid, username, profileImg);

      // Return true to allow the sign in process to continue
      return true;
    },
    async session({ session, token, user }) {
      session.user.username = session.user.name.split(' ').join('').toLocaleLowerCase();
      session.user.uid = token.sub
      return session;
    }
  }
}

async function createUser(uid, username, profileImg) {
  console.log(uid, username, profileImg)
  try {
    // Check if the user already exists
    const userQuery = query(collection(db, 'users'), where('uid', '==', uid));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      console.log('User already exists with ID:', uid);
      return uid;
    }

    // Create a new user if it doesn't exist
    const newUser = {
      uid: uid,
      username: username,
      profileImg: profileImg,
      createdAt: new Date(),
    };

    const userRef = await addDoc(collection(db, 'users'), newUser);
    console.log('New user created with ID:', userRef.id);

    return userRef.id;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
}

export default NextAuth(authOptions)