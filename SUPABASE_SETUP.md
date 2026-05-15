# Supabase'i seadistamine

Siin on juhised, kuidas oma projektile Supabase andmebaas seadistada.

## 1. Loo Supabase projekt
1. Mine [supabase.com](https://supabase.com) ja logi sisse.
2. Vajuta **"New project"**.
3. Pane nimeks `mm-ennustus` (vms), genereeri tugev andmebaasi parool ja vali regioon (nt Frankfurt).
4. Oota, kuni projekt luuakse (võtab paar minutit).

## 2. Kopeeri API võtmed
1. Mine oma Supabase projektis: **Project Settings -> API**.
2. Kopeeri **Project URL** ja pane see oma lokaalsesse `.env.local` faili `NEXT_PUBLIC_SUPABASE_URL` väärtuseks.
3. Kopeeri **anon public** võti ja pane see `.env.local` faili `NEXT_PUBLIC_SUPABASE_ANON_KEY` väärtuseks.

*(Märkus: `.env.local` faili pead looma `.env.local.example` põhjal)*

## 3. Käivita andmebaasi migratsioonid (SQL)
Et luua kõik vajalikud tabelid ja turvapoliitikad:
1. Mine Supabase menüüs **SQL Editor**.
2. Vajuta **"New Query"**.
3. Kopeeri kogu tekst failist `supabase/migrations/00001_initial_schema.sql` ja kleebi see SQL Editori.
4. Vajuta **"Run"** (või Cmd/Ctrl + Enter).
5. Seejärel tee uus päring (New Query) ja käivita faili `supabase/seed.sql` sisu, et luua algsed turniiri andmed.

## 4. Admin õiguste andmine endale
Kui oled äpis kasutaja loonud, tahad tõenäoliselt ennast administraatoriks teha:
1. Registreeri endale äpis konto.
2. Mine Supabase menüüs **Table Editor** -> `profiles` tabel.
3. Leia oma rida ja muuda `is_admin` väärtus `false` pealt `true` peale.
4. Vajuta **Save**.

## 5. Storage (Piltide üleslaadimine)
Kui tahame lubada kasutajatel avatare üles laadida:
1. Mine Supabase menüüs **Storage**.
2. Vajuta **"New bucket"**.
3. Pane nimeks `avatars` ja tee see **Public** bucketiks.
4. Salvesta. (Turvapoliitikad failide üleslaadimiseks lisame hiljem).

Kõik ongi valmis! 🎉
