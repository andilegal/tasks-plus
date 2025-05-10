import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export const Header = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 w-full h-[80px] flex items-center shadow-md">
      <section className="container mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-full">
        <Link
          className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide"
          href="/"
        >
          TAREFAS<span className="text-red-500 text-4xl">+</span>
        </Link>
        <nav className="flex items-center gap-6">
          {session?.user && (
            <>
              <button
                className="text-white sm:hidden font-semibold py-2 px-4 rounded-md border border-white transition-all duration-300 hover:bg-white hover:text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Menu
              </button>
              <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform ${
                  isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 sm:hidden`}
              >
                <button
                  className="text-white font-semibold py-2 px-4 mt-4 ml-4 rounded-full border border-white transition-all duration-300 hover:bg-red-500 hover:border-red-500 flex items-center shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Fechar
                </button>
                <div className="mt-8 px-6">
                  <p className="text-white text-lg mb-6">
                    Olá, {session.user?.name}
                  </p>
                  <Link
                    className="block text-white font-semibold py-3 px-4 rounded-md border border-white transition-all duration-300 text-center hover:bg-white hover:text-gray-900 mb-4"
                    href="/dashboard"
                  >
                    Meu Painel
                  </Link>
                  <button
                    className="block w-full cursor-pointer text-left px-4 py-3 text-sm text-white hover:bg-gray-700 rounded-md"
                    onClick={() => signOut()}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
          {session?.user && (
            <Link
              className="hidden sm:block text-white font-semibold py-2 px-6 rounded-full border border-white transition-all duration-300 hover:bg-white hover:text-gray-900 shadow-lg"
              href="/dashboard"
            >
              Meu Painel
            </Link>
          )}
          {status === 'loading' ? (
            <span className="text-white hidden sm:block">Carregando...</span>
          ) : session ? (
            <div className="relative group hidden sm:block">
              <button className="text-white font-semibold py-2 px-6 rounded-full border border-white transition-all duration-300 hover:bg-white hover:text-gray-900">
                Olá, {session.user?.name}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 rounded-md"
                  onClick={() => signOut()}
                >
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              className="text-white cursor-pointer font-semibold py-2 px-6 rounded-full border border-white transition-all duration-300 hover:bg-white hover:text-gray-900 shadow-lg"
              onClick={() => signIn('google')}
            >
              Acessar
            </button>
          )}
        </nav>
      </section>
    </header>
  );
};
