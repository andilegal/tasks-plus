import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { TextArea } from '@/components';
import { BiClipboard, BiTrash } from 'react-icons/bi';
import { FiShare2 } from 'react-icons/fi';
import { useToast } from '@/provider/toast-provider';
import { db } from '@/services/firebase.connects';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { BsClipboard2 } from 'react-icons/bs';

type DashboardProps = {
  session?: {
    user: {
      name: string;
      email: string;
      image: string;
    };
  };
};

type TaskData = {
  comment: string;
  isPublic: boolean;
  user: string;
  name: string;
  createdAt: string;
  id: string;
};

export default function Dashboard({ session }: DashboardProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    comment: '',
    isPublic: false,
  });
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = session?.user;

  useEffect(() => {
    if (!user) {
      showToast({
        type: 'error',
        message: 'Usuário não autenticado!',
      });
    }

    async function fetchTasks() {
      setIsLoading(true);
      const tasksCollection = collection(db, 'tasks');
      const q = query(
        tasksCollection,
        orderBy('createdAt', 'desc'),
        where('user', '==', user?.email)
      );

      onSnapshot(q, (snapshot) => {
        const list = [] as TaskData[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            comment: doc.data().comment,
            isPublic: doc.data().isPublic,
            user: doc.data().user,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          });
        });

        setTasks(list);
        setIsLoading(false);
      });
    }
    fetchTasks();
  }, [user, showToast]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | any>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.comment) {
      showToast({
        type: 'error',
        message: 'Campo de comentário vazio!',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'tasks'), {
        comment: formData.comment,
        isPublic: formData.isPublic,
        user: user?.email,
        name: user?.name,
        createdAt: new Date(),
      });
      showToast({
        type: 'success',
        message: 'Tarefa adicionada com sucesso!',
      });

      setFormData({
        comment: '',
        isPublic: false,
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      showToast({
        type: 'error',
        message: 'Erro ao adicionar tarefa!',
      });
    }
  };

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/tasks/${id}`
    );
  }

  async function handleDelete(id: string) {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
    showToast({
      type: 'info',
      message: 'Tarefa removida com sucesso!',
    });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <Head>
        <title>Central de Tarefas</title>
        <meta name="description" content="Dashboard" />
      </Head>
      <main className="w-full max-w-4xl rounded-lg  p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center leading-tight mb-6">
          Central de Tarefas
        </h1>
        <form className="mb-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextArea
            className="bg-white h-[200px] border-none rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite um comentario"
            name="comment"
            title="Digite um comentario"
            value={formData?.comment}
            onChange={handleChange}
          />

          <label className="text-white cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              className="cursor-pointer"
              title="Marcar tarefa como concluída"
              name="isPublic"
              checked={formData?.isPublic}
              onChange={handleChange}
            />
            Deixar tarefa publica
          </label>
          <button
            type="submit"
            className={`bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition duration-300 flex items-center justify-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Adicionar tarefa"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              'Adicionar Tarefa'
            )}
          </button>
        </form>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Minhas Tarefas
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col gap-4 bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center w-full gap-4">
                    <div className="h-6 bg-gray-600 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-600 rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-gray-600 rounded w-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-4">
              {tasks.map((item) => (
                <li
                  key={item.createdAt}
                  className="flex flex-col gap-4 justify-between bg-gray-700 p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center w-full gap-4">
                    {item?.isPublic && (
                      <div className="flex items-center gap-4">
                        <button
                          className="text-sm pointer-events-none bg-blue-400 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-300"
                          title="Marcar tarefa como concluída"
                        >
                          Publico
                        </button>
                        <button
                          className="cursor-pointer"
                          title="Copiar link"
                          onClick={() => handleShare(item?.id)}
                        >
                          <BsClipboard2 color="#51a2ff" />
                        </button>
                      </div>
                    )}

                    <button
                      className="text-sm cursor-pointer justify-end items-end bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300"
                      title="Remover Tarefa"
                      onClick={() => handleDelete(item?.id)}
                    >
                      <BiTrash />
                    </button>
                  </div>
                  <div className="flex justify-between gap-4">
                    {item.isPublic ? (
                      <Link
                        href={`/task/${item?.id}`}
                        className="text-white whitespace-pre-line w-full"
                      >
                        {item.comment}
                      </Link>
                    ) : (
                      <span className="text-white whitespace-pre-line">
                        {item.comment}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async ({
  req,
}: {
  req: GetServerSidePropsContext['req'];
}) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
