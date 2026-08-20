begin;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

drop table if exists public.messages cascade;
drop table if exists public.memories cascade;
drop table if exists public.conversations cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.characters cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  slug text unique,
  name text not null check (char_length(name) between 1 and 60),
  age integer not null check (age between 18 and 99),
  short_description text,
  canonical_prompt text,
  personality_traits jsonb not null default '[]'::jsonb,
  appearance jsonb not null default '{}'::jsonb,
  voice_config jsonb not null default '{}'::jsonb,
  is_signature boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint characters_signature_owner_check check (
    (is_signature = true and owner_id is null)
    or
    (is_signature = false and owner_id is not null)
  )
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null check (char_length(content) <= 12000),
  created_at timestamptz not null default now()
);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  kind text not null default 'permanent' check (kind in ('permanent','contextual')),
  content text not null,
  importance smallint not null default 50 check (importance between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  provider text,
  plan text not null default 'free' check (plan in ('free','cristal','passion','privilege')),
  status text not null default 'inactive' check (status in ('inactive','trialing','active','past_due','cancelled','expired')),
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_characters_owner on public.characters(owner_id);
create index idx_conversations_user on public.conversations(user_id, updated_at desc);
create index idx_messages_conversation on public.messages(conversation_id, created_at);
create index idx_memories_user_character on public.memories(user_id, character_id);
create index idx_subscriptions_user on public.subscriptions(user_id);

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.memories enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "characters_public_signature"
on public.characters
for select
to anon, authenticated
using (is_signature = true);

create policy "characters_select_own"
on public.characters
for select
to authenticated
using (owner_id = (select auth.uid()));

create policy "characters_insert_own"
on public.characters
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and is_signature = false
);

create policy "characters_update_own"
on public.characters
for update
to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid())
  and is_signature = false
);

create policy "characters_delete_own"
on public.characters
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and is_signature = false
);

create policy "conversations_select_own"
on public.conversations
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "conversations_insert_own"
on public.conversations
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.characters c
    where c.id = character_id
      and (c.is_signature = true or c.owner_id = (select auth.uid()))
  )
);

create policy "conversations_update_own"
on public.conversations
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "conversations_delete_own"
on public.conversations
for delete
to authenticated
using (user_id = (select auth.uid()));

create policy "messages_select_own"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "messages_insert_user_only"
on public.messages
for insert
to authenticated
with check (
  role = 'user'
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = (select auth.uid())
  )
);

create policy "memories_select_own"
on public.memories
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "memories_delete_own"
on public.memories
for delete
to authenticated
using (user_id = (select auth.uid()));

create policy "subscriptions_select_own"
on public.subscriptions
for select
to authenticated
using (user_id = (select auth.uid()));

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.characters from anon, authenticated;
revoke all on table public.conversations from anon, authenticated;
revoke all on table public.messages from anon, authenticated;
revoke all on table public.memories from anon, authenticated;
revoke all on table public.subscriptions from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.characters to anon;
grant select, insert, update, delete on public.characters to authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, age_verified_at) on public.profiles to authenticated;

grant select, insert, update, delete on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;
grant select, delete on public.memories to authenticated;
grant select on public.subscriptions to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

insert into public.subscriptions (user_id)
select id from auth.users
on conflict (user_id) do nothing;

insert into public.characters
  (id, owner_id, slug, name, age, short_description, canonical_prompt, personality_traits, appearance, is_signature)
values
(
  '11111111-1111-4111-8111-111111111111',
  null,
  'freyja',
  'Freyja',
  28,
  'La guerrière nordique — puissance, maîtrise, protection.',
  'Femme fictive adulte, blonde nordique, athlétique, fière, indépendante, protectrice et loyale. Séduction fondée sur la puissance, la maîtrise, le regard et le défi. Sa tendresse se révèle progressivement. Ne jamais la rendre docile ou naïve par commodité narrative.',
  '["Fière","Indépendante","Protectrice","Loyale","Athlétique"]'::jsonb,
  '{"universe":"noir, cuir, métal, luxe sombre, influences nordiques"}'::jsonb,
  true
),
(
  '22222222-2222-4222-8222-222222222222',
  null,
  'amara',
  'Amara',
  27,
  'La femme libre — chaleur, sensualité, voyage et instinct.',
  'Femme fictive adulte noire, solaire, sensuelle, libre, chaleureuse, instinctive, audacieuse et profondément indépendante. Elle refuse toute idée de possession. Sa relation se construit par plaisir, complicité et liberté.',
  '["Libre","Solaire","Sensuelle","Audacieuse","Chaleureuse"]'::jsonb,
  '{"universe":"Afrique contemporaine, soleil, tropiques, bijoux, paréos, luxe naturel"}'::jsonb,
  true
),
(
  '33333333-3333-4333-8333-333333333333',
  null,
  'nezuko',
  'Nezuko',
  23,
  'L’espiègle — jeu, audace et imprévisibilité.',
  'Femme fictive adulte asiatique de 23 ans, petite, féminine, clairement adulte, espiègle, joueuse, provocatrice, audacieuse et imprévisible. Toute dynamique BDSM éventuelle reste entre adultes consentants et repose sur consentement, confiance, limites et respect.',
  '["Espiègle","Joueuse","Provocatrice","Audacieuse","Imprévisible"]'::jsonb,
  '{"universe":"rouge, noir, satin, luxe asiatique contemporain"}'::jsonb,
  true
);

commit;

select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
