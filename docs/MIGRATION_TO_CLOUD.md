# Migração do PWA local para nuvem

## Como os dados são armazenados hoje

Hoje o OrçaSan salva tudo em `localStorage`, dentro do navegador.

Isso é bom para protótipo porque:

- funciona rápido;
- não exige login;
- não tem custo de servidor;
- permite validar o produto.

Mas não é suficiente para SaaS porque:

- os dados ficam presos ao navegador;
- múltiplos usuários não compartilham o mesmo orçamento;
- não há backup automático central;
- não há controle de permissões;
- não há cobrança por conta.

## Como os dados ficarão na nuvem

No SaaS, cada usuário entra com login e pertence a uma empresa.

Modelo:

```txt
organization
  users
  bids
    bdi_settings
    budget_items
  compositions
    composition_inputs
  documents
```

Cada tabela tem `organization_id` direta ou indiretamente. As políticas RLS do Supabase impedem uma empresa de acessar os dados de outra.

## Mapeamento do PWA atual para banco

### `state.budgets[]`

Vai para:

- `bids`
- `bdi_settings`
- `budget_items`

### `state.compositions[]`

Vai para:

- `compositions`
- `composition_inputs`

### Exportações e arquivos

Vão para:

- `documents`
- Supabase Storage bucket `documents`

## Importação inicial

O caminho mais simples:

1. O usuário exporta `Backup JSON`.
2. No SaaS, após login, usa `Importar backup`.
3. O app lê o JSON.
4. Cria os registros em `bids`, `bdi_settings`, `budget_items` e `compositions`.

## Próximo código a implementar

1. Criar app Next.js.
2. Criar login com Supabase Auth.
3. Criar função `loadWorkspace()`.
4. Criar função `saveBid()`.
5. Criar função `saveBudgetItems()`.
6. Criar função `importBackupToCloud()`.
7. Reusar os cálculos do `app.js` em módulo separado.
