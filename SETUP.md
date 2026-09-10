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
2. Copy the **Project URL**, the **anon public** key, and the
   **service_role** secret key.
3. In this project's folder, copy `.env.example` to a new file named
   `.env.local`, and paste the values in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your anon public key
   SUPABASE_SERVICE_ROLE_KEY=your service_role secret key
   ```

   The service_role key is only ever used on the server (to let the admin
   "Users" page create accounts) — it's never sent to the browser. Keep it
   private; don't share it or commit it anywhere.

## 3. Set up the database

1. In Supabase, go to the **SQL Editor** → **New query**.
2. Open the file `supabase/schema.sql` in this project, copy all of it, paste
   it into the SQL editor, and click **Run**.
3. This creates the tables (products, requests, etc.), the security rules,
   and a storage bucket for product photos. It's safe to re-run this file
   any time after an update — it always picks up the latest rules.

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
3. Log out and back in — you'll now land on the admin screens instead of the
   customer catalog.

From here on, use **Admin → Users** inside the app itself to create staff
and customer accounts — no need to touch Supabase directly for that anymore.
Staff can manage products and requests but not create users; only an owner
can do that (or promote someone to owner, which — for safety — still has to
be done manually in the Supabase `profiles` table, same as step 2).

## 6. Put it online

This app is set up to deploy on **Netlify**:

1. Push this project to a GitHub repository.
2. Go to https://app.netlify.com, sign up (GitHub sign-in is fastest), and
   click **Add new site** → **Import an existing project** → choose the repo.
3. Netlify auto-detects Next.js. Before deploying, add the same three
   environment variables from step 2 above under **Environment variables**.
4. Click **Deploy**. Netlify gives you a live web address you can share with
   customers.
5. If the site shows "This site is private" after deploying, go to
   **Site configuration → Visitor access** and turn off any restriction —
   the app has its own login system built in, so this extra gate isn't
   needed.
