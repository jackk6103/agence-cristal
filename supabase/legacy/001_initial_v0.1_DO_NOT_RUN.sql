-- Agence Cristal — schema initial V0.1
-- À exécuter dans Supabase SQL Editor sur un projet dédié.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_verified_at timestamptz,
  plan text not null default 'free' check (plan in ('free','cristal','passion','privilege')),
  created_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  slug text unique,
  name text not null check (char_length(name) between 1 and 60),
  age int not null default 25 check (age >= 18 and age <= 99),
  short_description text,
  canonical_prompt text,
  personality_traits jsonb not null default '[]'::jsonb,
  appearance jsonb not null default '{}'::jsonb,
  voice_config jsonb not null default '{}'::jsonb,
  is_signature boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint signature_owner check ((is_signature and owner_id is null) or (not is_signature and owner_id is not null))
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null check (char_length(content) <= 12000),
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  kind text not null default 'permanent' check (kind in ('permanent','contextual')),
  content text not null,
  importance smallint not null default 50 check (importance between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_characters_owner on public.characters(owner_id);
create index if not exists idx_conversations_user on public.conversations(user_id, updated_at desc);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);
create index if not exists idx_memories_user_character on public.memories(user_id, character_id);

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.memories enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "characters_read_signature_or_own" on public.characters for select using (is_signature or owner_id = auth.uid());
create policy "characters_insert_own" on public.characters for insert with check (owner_id = auth.uid() and is_signature = false);
create policy "characters_update_own" on public.characters for update using (owner_id = auth.uid()) with check (owner_id = auth.uid() and is_signature = false);
create policy "characters_delete_own" on public.characters for delete using (owner_id = auth.uid() and is_signature = false);

create policy "conversations_all_own" on public.conversations for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "messages_read_own_conversation" on public.messages for select using (
  exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);
create policy "messages_insert_own_conversation" on public.messages for insert with check (
  exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);
create policy "messages_delete_own_conversation" on public.messages for delete using (
  exists (select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid())
);

create policy "memories_all_own" on public.memories for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.characters (id, owner_id, slug, name, age, short_description, canonical_prompt, personality_traits, is_signature)
values
('11111111-1111-4111-8111-111111111111', null, 'freyja', 'Freyja', 28, 'La guerrière nordique — puissance, maîtrise, protection.', 'Femme fictive adulte, blonde nordique, athlétique, fière, indépendante, protectrice et loyale. Ne jamais la rendre docile ou naïve par commodité narrative.', '["Fière","Protectrice","Athlétique","Loyale"]'::jsonb, true),
('22222222-2222-4222-8222-222222222222', null, 'amara', 'Amara', 27, 'La femme libre — chaleur, sensualité, voyage et instinct.', 'Femme fictive adulte noire, solaire, libre, chaleureuse, instinctive, audacieuse et profondément indépendante. Elle refuse toute idée de possession.', '["Libre","Solaire","Audacieuse","Chaleureuse"]'::jsonb, true),
('33333333-3333-4333-8333-333333333333', null, 'nezuko', 'Nezuko', 23, 'L’espiègle — jeu, audace et imprévisibilité.', 'Femme fictive adulte asiatique de 23 ans, petite, féminine, clairement adulte, espiègle, joueuse, provocatrice et imprévisible. Toute dynamique intime reste consentie et adulte.', '["Espiègle","Joueuse","Provocatrice","Imprévisible"]'::jsonb, true)
on conflict (id) do nothing;
