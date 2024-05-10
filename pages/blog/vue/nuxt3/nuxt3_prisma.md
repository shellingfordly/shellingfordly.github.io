---
title: nuxt3 + prisma
date: 2024-5-10 17:56:26
tags:
  - nuxt3
  - prisma
---

### install

```
pnpm i @nuxtjs/supabase @prisma/client prisma uuid
```

### prisma & supabase

#### register supabase

1. new project

for get supabase url and supabase key

2. create storage bucket

for get database url

#### set supabase key

```
SUPABASE_URL=replace_me
SUPABASE_KEY=replace_me
```

#### prisma

初始化 Prisma ORM 项目

```
npx prisma init
```

#### database url

- get database url

Project Setting -> Database -> Display connection pooler

```
DATABASE_URL="postgres://postgres.ukoudvxifshkjrnorbsn:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

#### generate

```
npx prisma generate
```

#### migrate modal

将数据模型映射到数据库架构

```
npx prisma migrate dev --name init
```

sqlite 数据库使用

```
npx prisma db push
```
