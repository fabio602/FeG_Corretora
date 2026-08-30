-- ============================================================
-- F&G Seguro Garantia -- Supabase schema
-- Cole no SQL Editor do seu projeto Supabase e clique em Run.
-- ============================================================

-- Tabela: newsletter_inscritos
-- Armazena assinantes do blog. email unique para evitar duplicatas.
create table if not exists newsletter_inscritos (
  id         uuid        default gen_random_uuid() primary key,
  email      text        not null unique,
  nome       text,
  origem     text,
  created_at timestamptz default now()
);

alter table newsletter_inscritos enable row level security;

-- Apenas INSERT publico (anon). Nenhum SELECT para anon.
create policy "anon_insert_newsletter"
  on newsletter_inscritos for insert to anon
  with check (true);

-- -------------------------------------------------------

-- Tabela: leads_materiais
-- Armazena leads que baixaram materiais gratuitos.
-- UNIQUE (email, material) -> 409 no segundo download do mesmo arquivo
-- pelo mesmo e-mail (tratado como sucesso no front-end).
create table if not exists leads_materiais (
  id         uuid        default gen_random_uuid() primary key,
  nome       text        not null,
  email      text        not null,
  empresa    text,
  material   text        not null,
  origem     text,
  created_at timestamptz default now(),
  unique (email, material)
);

alter table leads_materiais enable row level security;

create policy "anon_insert_lead"
  on leads_materiais for insert to anon
  with check (true);
