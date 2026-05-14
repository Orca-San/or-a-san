# Corrigir erro no SQL Editor do Supabase

Pela tela, o SQL apareceu traduzido no editor (`criar tabela`, `padrão`, `não nulo`). Isso quebra o SQL.

## Como corrigir

1. No Chrome, desative a tradução da página do Supabase.
   - Clique no ícone do Google Tradutor na barra do navegador.
   - Escolha `Mostrar original` ou `Nunca traduzir este site`.
   - Recarregue a página.

2. No Supabase SQL Editor, apague tudo que está no editor.

3. Se alguma parte do schema já rodou antes, execute primeiro:

```txt
supabase/reset.sql
```

4. Depois copie e cole o arquivo completo, sem tradução:

```txt
supabase/schema.sql
```

5. Clique em `Run`.

## Dicas importantes

- Não execute só uma parte do arquivo, porque algumas tabelas dependem de outras.
- SQL precisa ficar em inglês.
- Não deixe o navegador traduzir nomes de comandos.
- Se aparecer erro `already exists`, rode `reset.sql` e depois rode `schema.sql` de novo.

## O que deve acontecer quando der certo

O Supabase deve criar tabelas como:

- `organizations`
- `profiles`
- `organization_members`
- `bids`
- `bdi_settings`
- `budget_items`
- `compositions`
- `composition_inputs`
- `documents`
- `audit_events`
