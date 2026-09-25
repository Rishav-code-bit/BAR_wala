insert into storage.buckets (id, name, public)
values ('songs', 'songs', true)
on conflict (id) do update set public = excluded.public;

create table if not exists public.tracks (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  artist text not null default 'Unknown artist',
  audio_path text not null unique,
  lyrics_path text not null,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now()
);

alter table public.tracks enable row level security;
grant select, insert on public.tracks to anon;

drop policy if exists "Public can read tracks" on public.tracks;
create policy "Public can read tracks"
  on public.tracks for select to anon
  using (true);

drop policy if exists "Public can add tracks" on public.tracks;
create policy "Public can add tracks"
  on public.tracks for insert to anon
  with check (true);

drop policy if exists "Public can read song files" on storage.objects;
create policy "Public can read song files"
  on storage.objects for select to anon
  using (bucket_id = 'songs');

drop policy if exists "Public can upload song files" on storage.objects;
create policy "Public can upload song files"
  on storage.objects for insert to anon
  with check (bucket_id = 'songs');

drop policy if exists "Public can remove song files" on storage.objects;
