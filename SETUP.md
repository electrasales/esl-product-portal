# Setup Guide (Plain Language)

This app needs a free Supabase account (it's the database + login system) before
it will work. Follow these steps once.

## 1. Create a Supabase project

1. Go to https://supabase.com and sign up (free).
2. Click **New project**. Pick any name (e.g. "esl-product-portal") and a
   password for the database (save it somewhere safe — you likely won't need
   it again, but keep it just in case).
3. Wait ~2 minutes for the project to finish setting up.

## 2. Get your project's keys

1. In your new Supabase project, go to **Project Settings** (gear icon) →
   **API**.
2. Copy the **Project URL** and the **anon public** key.
3. In this project's folder, copy `.env.example` to a new file named
   `.env.local`, and paste the values in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your anon public key
   ```

## 3. Set up the database

1. In Supabase, go to the **SQL Editor** → **New query**.
2. Open the file `supabase/schema.sql` in this project, copy all of it, paste
   it into the SQL editor, and click **Run**.
3. This creates the tables (products, requests, etc.), the security rules,
   and a storage bucket for product photos.

## 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 5. Create the owner account

1. Sign up in the app like a normal customer would (use the email you, the
   business owner, want to log in with).
2. In Supabase, go to **Table Editor** → `profiles`, find the row with your
   email/name, and change its `role` column from `customer` to `owner`.
3. Log out and back in — you'll now land on the admin screens (Products,
   Requests) instead of the customer catalog.

Every account after that signs up as a regular customer automatically.

## 6. Put it online (optional, when you're ready)

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, sign up, and import that repository.
3. When Vercel asks for environment variables, paste in the same
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from step 2.
4. Deploy. Vercel gives you a live web address you can share with customers.
