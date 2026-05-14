# Publicar o OrçaSan no GitHub e Vercel

Este é o caminho mais rápido para colocar o PWA atual no ar.

## 1. Criar repositório no GitHub

1. Entre no GitHub.
2. Clique em `New repository`.
3. Nome sugerido: `orcasan`.
4. Deixe como `Private` enquanto ainda estamos desenvolvendo.
5. Não precisa marcar README, `.gitignore` ou licença, porque este projeto já tem esses arquivos.
6. Crie o repositório.

## 2. Subir os arquivos

Opção pelo site:

1. Abra o repositório criado.
2. Clique em `Add file` > `Upload files`.
3. Arraste todos os arquivos e pastas deste projeto:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `service-worker.js`
   - `manifest.webmanifest`
   - `vercel.json`
   - `.gitignore`
   - `.env.example`
   - `README.md`
   - `icons/`
   - `docs/`
   - `supabase/`
4. Clique em `Commit changes`.

Não envie arquivo `.env` real com senhas ou chaves.

## 3. Conectar na Vercel

1. Entre na Vercel.
2. Clique em `Add New` > `Project`.
3. Escolha o repositório `orcasan`.
4. Framework preset: `Other`.
5. Build command: deixe vazio.
6. Output directory: deixe vazio ou use `.`.
7. Clique em `Deploy`.

## 4. Testar

Depois do deploy, teste:

- abrir o link gerado pela Vercel;
- navegar nas abas;
- criar licitação;
- preencher BDI;
- gerar planilha;
- gerar proposta;
- exportar backup;
- instalar como app pelo navegador.

## 5. Domínio próprio

Depois que estiver validado:

1. Compre um domínio, por exemplo `orcasan.com.br`.
2. Na Vercel, vá em `Project Settings` > `Domains`.
3. Adicione o domínio.
4. Siga as instruções de DNS.

## 6. Próximo passo depois de publicar

Quando o PWA estiver no ar, o próximo passo é criar a versão SaaS:

- Next.js;
- Supabase Auth;
- PostgreSQL;
- dados salvos na nuvem;
- login por empresa;
- planos pagos.
