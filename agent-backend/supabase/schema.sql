-- 1. Create Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Messages Table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  user_id uuid references auth.users not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.messages enable row level security;

-- Policies for Projects (Users can only see and manage their own projects)
create policy "Users can view their own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert their own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete their own projects" on projects for delete using (auth.uid() = user_id);

-- Policies for Messages (Users can only see and manage messages in their projects)
create policy "Users can view their own messages" on messages for select using (auth.uid() = user_id);
create policy "Users can insert their own messages" on messages for insert with check (auth.uid() = user_id);
