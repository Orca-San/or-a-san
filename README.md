# OrçaSan

Protótipo funcional local para orçamento de licitações de obras de saneamento básico.

## Como usar neste computador

Abra no navegador:

```txt
http://127.0.0.1:8097/index.html
```

Os dados ficam salvos no navegador usando `localStorage`.

## Nuvem Supabase em modo protótipo

A aba `Configurações` agora tem uma área `Nuvem Supabase` para testar a gravação dos dados no banco:

1. Cole a `API URL` do Supabase.
2. Cole somente a `Publishable key`.
3. Clique em `Salvar conexão`.
4. Clique em `Testar conexão`.
5. Clique em `Criar workspace`.
6. Use `Enviar licitação atual` ou `Enviar tudo`.
7. Em outra máquina, cole a mesma conexão e use `Carregar da nuvem`.

Não use a `Secret key` no navegador. Antes de liberar para clientes reais, ative login e Row Level Security no Supabase.

## Login e segurança

A tela `Conta` fica separada do aplicativo:

1. Informe nome, empresa, e-mail e senha.
2. Clique em `Criar conta` ou `Entrar`.
3. Use `Recuperar senha` quando necessário.

O aplicativo principal só é exibido depois que houver uma sessão válida de conta.

Para sair do modo protótipo aberto e voltar ao modo seguro, rode no Supabase:

- [RLS seguro com login](supabase/06_secure_auth_rls.sql)

Se o Supabase pedir confirmação de e-mail, confirme a conta antes de entrar. Em ambiente de teste, também é possível ajustar isso no painel Auth do Supabase.

Se o link de confirmação abrir uma página quebrada, configure no Supabase:

- `Authentication > URL Configuration > Site URL`: `https://orcasan.vercel.app`
- `Authentication > URL Configuration > Redirect URLs`: `https://orcasan.vercel.app/**`
- Para testar localmente, adicione também: `http://127.0.0.1:8097/**`

Se o e-mail não chegar, o Supabase gratuito pode estar bloqueando ou limitando o envio pelo remetente padrão. Para teste rápido, use o mesmo e-mail da sua conta Supabase ou desative temporariamente `Confirm email` em `Authentication > Sign In / Providers > Email`. Para produção, configure SMTP próprio.

## Painel técnico

A configuração do Supabase não aparece para o cliente final. Para abrir o painel técnico, use:

```txt
http://127.0.0.1:8097/index.html?admin=1#configuracoes
```

Para ocultar novamente:

```txt
http://127.0.0.1:8097/index.html?admin=0#configuracoes
```

## Como instalar como aplicativo

O OrçaSan agora é um PWA. Em navegadores compatíveis, aparece o botão `Instalar app`.

Depois de instalado, ele abre em janela própria, com ícone e aparência de aplicativo.

No computador local, a instalação costuma funcionar em:

```txt
http://127.0.0.1:8097/index.html
```

Em produção, para instalar em outros computadores com mais estabilidade, publique em um domínio com HTTPS.

Passo a passo para um usuário:

1. Acesse o link publicado do OrçaSan.
2. Clique em `Instalar app`, se o botão aparecer.
3. Se o navegador mostrar um ícone de instalação na barra de endereço, clique nele.
4. Confirme a instalação.
5. Abra pelo atalho criado no menu iniciar/área de trabalho.

Se uma atualização não aparecer ou alguma aba ficar estranha, entre em `Configurações` e clique em `Atualizar app`.

## Como usar em outra máquina

Opção rápida:

1. Copie a pasta `bom-dia` para o outro computador.
2. Abra o arquivo `index.html` no navegador.
3. Se quiser levar os dados junto, clique em `Backup` no OrçaSan.
4. No outro computador, entre em `Configurações` e clique em `Importar backup`.

Opção com servidor local:

1. Instale Python 3 no outro computador, se ainda não tiver.
2. Abra o terminal dentro da pasta do OrçaSan.
3. Rode:

```bash
python -m http.server 8097 --bind 127.0.0.1
```

4. Acesse:

```txt
http://127.0.0.1:8097/index.html
```

## Quando vira SaaS de verdade

A versão SaaS precisa destas camadas:

1. Login de usuários e empresas.
2. Banco de dados PostgreSQL.
3. Backend/API para salvar licitações, itens, BDI e composições.
4. Hospedagem na nuvem.
5. Upload/importação de Excel.
6. Exportação profissional em PDF e XLSX.
7. Controle de permissões por equipe.

O protótipo atual já valida a experiência principal antes de investir nessa estrutura.

## Próxima fase criada

Já existe uma base para migração SaaS:

- [Passo a passo GitHub/Vercel](docs/GITHUB_VERCEL_STEPS.md)
- [Schema Supabase](supabase/schema.sql)
- [Schema Supabase em partes](docs/SUPABASE_RUN_IN_PARTS.md)
- [Deploy do SaaS](docs/DEPLOYMENT.md)
- [Migração para nuvem](docs/MIGRATION_TO_CLOUD.md)
- [Roadmap comercial](docs/SAAS_ROADMAP.md)
- [Variáveis de ambiente](.env.example)

## Caminhos para publicar

### Caminho 1: PWA estático

Mais rápido e barato.

- Hospedar `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `service-worker.js` e `icons/`.
- Pode usar Vercel, Netlify, GitHub Pages ou servidor próprio.
- Cada usuário salva dados no próprio navegador.
- Backup/importação JSON leva os dados entre máquinas.

### Caminho 2: SaaS com login

Produto comercial de verdade.

- Frontend em Next.js.
- Banco PostgreSQL.
- Login por empresa/usuário.
- Dados salvos na nuvem.
- Acesso por qualquer máquina com o mesmo login.
- Controle de planos, permissões e assinatura.
