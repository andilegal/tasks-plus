import { db } from '@/services/firebase.connects';
import { collection, getDocs } from 'firebase/firestore';
import Head from 'next/head';
import Image from 'next/image';
import { comment } from 'postcss';

const heroImage = '/assets/hero.png';

interface HomeProps {
  comments: number;
  posts: number;
}

export default function Home({ comments, posts }: HomeProps) {
  return (
    <div>
      <title>
        <Head>Tarefas | Organze suas tarefas de foma facil</Head>
      </title>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8  d-flex w-full flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center h-full">
          <Image
            src={heroImage}
            className="object-fit max-w-480px max-h-480px"
            alt="image"
            width="400"
            height="400"
            priority
          />

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center leading-7 sm:leading-9 md:leading-11 mt-4">
            Sistema feito para organizar suas <br /> tarefas de forma fácil e
            rápida
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-8 w-full sm:justify-center">
            <button
              className="bg-white text-black font-bold py-2 px-4 rounded w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
              title="Veja mais posts"
            >
              +{posts} posts
            </button>
            <button
              className="bg-white text-black font-bold py-2 px-4 rounded w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
              title="Veja mais comentários"
            >
              +{comments} comentarios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const commentRef = collection(db, 'comments');
  const postRef = collection(db, 'tasks');
  const commentsSnapshot = await getDocs(commentRef);
  const postsSnapshot = await getDocs(postRef);

  return {
    props: {
      posts: postsSnapshot.size | 0,
      comments: commentsSnapshot.size | 0,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};
