# Deploy do OrçaSan SaaS

Este documento descreve o caminho para transformar o PWA local em SaaS com login, banco na nuvem e acesso por link.

## Fase 1 - Publicar o PWA atual

Objetivo: colocar o protótipo em um link público para validação comercial.

Opções:

- Vercel
- Netlify
- GitHub Pages
- Servidor próprio com HTTPS

Arquivos necessários:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `service-worker.js`
- `icons/`

Limitação desta fase:

- Os dados ficam no navegador do usuário.
- Para levar dados entre máquinas, usa `Backup JSON`.

## Fase 2 - Criar projeto Supabase

1. Criar projeto no Supabase.
2. Abrir `SQL Editor`.
3. Rodar o arquivo `supabase/schema.sql`.
4. Ativar autenticação por e-mail.
5. Criar bucket de arquivos chamado `documents`.
6. Configurar variáveis de ambiente do `.env.example`.

## Fase 3 - Migrar para Next.js

Estrutura sugerida:

```txt
app/
  login/
  dashboard/
  licitacoes/
  licitacoes/[id]/
  composicoes/
  relatorios/
components/
lib/
  supabase/
  calculations/
  exports/
```

Responsabilidades:

- `lib/calculations`: BDI, totais, curva ABC.
- `lib/supabase`: cliente Supabase, queries e mutations.
- `lib/exports`: XLS, CSV, PDF.
- `components`: UI reutilizável.

## Fase 4 - Acesso comercial

Funcionalidades mínimas:

- Login.
- Organização/empresa.
- Usuários por empresa.
- Licitações salvas no banco.
- Itens salvos no banco.
- BDI salvo por licitação.
- Composições salvas por empresa.
- Exportação XLS/PDF.
- Backup automático do banco.

## Fase 5 - Cobrança

Sugestão de planos:

- Individual: 1 usuário, até 20 licitações ativas.
- Empresa: usuários ilimitados, licitações ilimitadas.
- Escritório: múltiplas empresas/clientes, relatórios avançados.

Integração sugerida:

- Stripe para cartão.
- Asaas ou Mercado Pago para boleto/Pix no Brasil.
