-- Enable RLS
alter table auth.users enable row level security;

-- 2. TABLE: messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  content text not null,
  role text check (role in ('user', 'system')),
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Users can access their own messages"
on messages for all
using (auth.uid() = user_id);

-- 3. TABLE: expenses
create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  amount integer not null,
  category text not null,
  note text,
  expense_date date default current_date,
  created_at timestamptz default now()
);

alter table expenses enable row level security;

create policy "Users can access their own expenses"
on expenses for all
using (auth.uid() = user_id);

-- 4. INDEXES
create index idx_expenses_user_id on expenses(user_id);
create index idx_expenses_expense_date on expenses(expense_date);
