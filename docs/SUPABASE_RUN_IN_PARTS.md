# Rodar o schema do Supabase em partes

Use este caminho quando o SQL Editor der erro `syntax error at end of input`.

Esse erro quase sempre significa que o editor executou só um pedaço do SQL.

## Ordem correta

1. Se houve tentativa anterior com erro, rode:

```txt
supabase/reset.sql
```

2. Rode o arquivo:

```txt
supabase/01_types_and_tables.sql
```

3. Depois rode:

```txt
supabase/02_functions_and_rls.sql
```

4. Por último rode:

```txt
supabase/03_policies_and_indexes.sql
```

## Atenção

- Apague o editor antes de colar cada parte.
- Não deixe nenhum texto selecionado quando clicar em `Run`.
- Clique dentro do editor e use `Ctrl+A`, apague, cole a próxima parte.
- A página do Supabase não pode estar traduzida.

## Como saber se deu certo

Depois da Parte 1, devem aparecer tabelas como:

- `organizations`
- `profiles`
- `bids`
- `budget_items`
- `compositions`

Depois da Parte 3, as políticas de segurança estarão ativas.
