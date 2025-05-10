import { useToast } from '@/provider/toast-provider';
import { db } from '@/services/firebase.connects';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { BiTrash } from 'react-icons/bi';

type AllCommentsProps = {
  id: string;
  comment: string;
  user: string;
  name: string;
  createdAt: string;
};

export default function Tasks({
  taskItem,
  allComments,
}: {
  taskItem: {
    id: string;
    name: string;
    user: string;
    createdAt: string;
    comment: string;
  };
  allComments: AllCommentsProps[];
}) {
  const { data: userData } = useSession();
  const { showToast } = useToast();
  const [textArea, setTextArea] = useState('');
  const [comments, setComments] = useState<AllCommentsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Simula o carregamento inicial dos comentários
    setTimeout(() => {
      setComments(allComments || []);
      setIsLoading(false); // Finaliza o carregamento
    }, 1000); // Simula um atraso de 1 segundo
  }, [allComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (textArea.trim() === '') {
      showToast({
        type: 'error',
        message: 'O campo de comentário não pode estar vazio.',
      });
      return;
    }

    if (!userData?.user || !userData?.user?.email) {
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: textArea,
        user: userData?.user?.email,
        id: taskItem.id,
        createdAt: new Date(),
        name: userData?.user?.name,
      });

      const data = {
        id: docRef.id,
        comment: textArea,
        user: userData?.user?.email,
        name: userData?.user?.name || 'Usuário desconhecido',
        createdAt: new Date().toLocaleDateString(),
      };

      setComments((prevComments) => [...prevComments, data]);

      setTextArea('');
      showToast({
        type: 'success',
        message: 'Comentário adicionado com sucesso!',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro ao adicionar comentário. Tente novamente.',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== commentId)
      );
      showToast({
        type: 'success',
        message: 'Comentário deletado com sucesso!',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Erro ao deletar comentário. Tente novamente.',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col mt-8">
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <div className="w-full max-w-md sm:max-w-full gap-3 flex flex-col mx-auto shadow-md rounded-lg p-6 bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">
          {taskItem?.name}
        </h1>
        <p className="text-gray-400 mb-2">
          <strong>Usuário:</strong> {taskItem?.user}
        </p>
        <p className="text-gray-400 mb-4">
          <strong>Criado em:</strong> {taskItem?.createdAt}
        </p>
        <div className="text-gray-400 mb-2 p-3 border-solid border-[1px] border-gray-700 rounded-lg min-h-72">
          {taskItem?.comment}
        </div>
        <form
          className="border border-gray-700 rounded-lg p-4 mb-4"
          onSubmit={handleSubmit}
        >
          <p className="text-gray-400 mb-2">
            <strong>Deixar Comentário:</strong>
          </p>
          <textarea
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 mb-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deixe seu comentário aqui..."
            rows={4}
            value={textArea}
            onChange={(e) => setTextArea(e.target.value)}
          />

          <button
            disabled={!userData?.user}
            className="disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Comentar
          </button>
        </form>
      </div>

      <div className="w-full max-w-md sm:max-w-full gap-3 flex flex-col mx-auto shadow-md rounded-lg p-6 bg-gray-800 mt-6">
        <h2 className="text-xl font-bold text-gray-100 mb-4">
          Todos os Comentários
        </h2>
        {isLoading ? ( // Exibe o skeleton enquanto está carregando
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-700 rounded-lg border border-gray-600 animate-pulse"
              >
                <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="p-4 bg-gray-700 flex justify-between items-center rounded-lg border border-gray-600 text-gray-100"
              >
                <div>
                  <p className="text-gray-400 mb-2">
                    <strong>{comment.name}</strong> - {comment.createdAt}
                  </p>
                  <p>{comment.comment}</p>
                </div>
                {comment.user === userData?.user?.email && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className=" bg-red-500  text-white cursor-pointer px-4 h-[45px] flex justify-center items-center rounded-lg hover:bg-red-600 transition"
                  >
                    <BiTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Nenhum comentário encontrado.</p>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = params;

  const q = query(collection(db, 'comments'), where('id', '==', id));

  const snapComments = await getDocs(q);
  let allComments: AllCommentsProps[] = [];
  snapComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      createdAt: new Date(
        doc.data().createdAt.seconds * 1000
      ).toLocaleDateString(),
      name: doc.data().name,
    });
  });

  const docRef = doc(db, 'tasks', id);
  const docSnap = await getDoc(docRef);
  const taskData = docSnap.data();

  if (!taskData === undefined || !taskData?.isPublic) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const milisseconds = docSnap.data()?.createdAt?.seconds * 1000;
  const taskItem = {
    comment: docSnap.data()?.comment,
    createdAt: new Date(milisseconds).toLocaleDateString(),
    user: docSnap?.data()?.user,
    name: docSnap?.data()?.name,
    isPublic: docSnap?.data()?.isPublic,
    id,
  };

  return {
    props: { taskItem, allComments },
  };
};
