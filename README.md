# Tasks Plus

Tasks Plus é uma aplicação web moderna e responsiva desenvolvida para ajudar os usuários a organizar suas tarefas de forma eficiente e prática. O projeto utiliza tecnologias de ponta como **Next.js**, **Firebase** e **Tailwind CSS**, proporcionando uma experiência de usuário fluida e intuitiva.

## Funcionalidades

- **Gerenciamento de Tarefas**:
  - Sistema simples e intuitivo para organizar tarefas.
  - Exibição de tarefas e comentários armazenados no banco de dados Firebase.
- **Interface Responsiva**:
  - Layout adaptável para dispositivos móveis, tablets e desktops.
  - Design moderno e minimalista.
- **Integração com Firebase**:
  - Banco de dados Firestore para armazenamento de tarefas e comentários.
  - Configuração de autenticação e armazenamento de dados.
- **Estilização com Tailwind CSS**:
  - Estilos utilitários para personalização rápida.
  - Componentes estilizados para uma experiência visual consistente.
- **Componentes Reutilizáveis**:
  - Botões, imagens e layouts otimizados para reutilização em diferentes partes do projeto.
- **Revalidação Incremental**:
  - Atualização automática de dados a cada 60 segundos para garantir informações sempre atualizadas.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor (SSR) e geração de sites estáticos (SSG).
- **Firebase**: Backend como serviço para autenticação, banco de dados e armazenamento.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e eficiente.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

Siga os passos abaixo para configurar o projeto localmente:

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/seu-usuario/tasks-plus.git
   cd tasks-plus
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Configure o Firebase**:

   - Substitua as credenciais no arquivo `src/services/firebase.connects.ts` com as suas configurações do Firebase.
   - Certifique-se de que o Firestore está habilitado no console do Firebase.

4. **Configure o Tailwind CSS**:

   - O Tailwind já está configurado no projeto. Certifique-se de que o arquivo `tailwind.config.js` contém o seguinte:
     ```javascript
     module.exports = {
       content: ['./src/**/*.{js,ts,jsx,tsx}'],
       theme: {
         extend: {},
       },
       plugins: [],
     };
     ```

5. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**:
   Abra o navegador e acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```plaintext
src/
├── pages/               # Páginas do Next.js
│   └── index.tsx        # Página inicial
├── services/            # Configurações de serviços externos
│   └── firebase.connects.ts # Configuração do Firebase
├── styles/              # Arquivos de estilo
│   └── globals.css      # Estilos globais
├── components/          # Componentes reutilizáveis
└── public/              # Arquivos estáticos (imagens, ícones, etc.)
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm start`: Inicia o servidor em modo de produção.
- `npm run format`: Formata o código usando Prettier.

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça as alterações necessárias e commit:
   ```bash
   git commit -m "Adiciona minha nova feature"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request no repositório original.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

**Desenvolvido com ❤️ por [Seu Nome]**
