# Web Archiver — Deployment na Render.com

## Krok 1: Zbuduj frontend (jednorazowo na Replit lub lokalnie)

```bash
# W folderze Replit, uruchom w konsoli:
cd /home/runner/workspace
BASE_PATH=/ pnpm --filter @workspace/web-archiver run build
cp -r artifacts/web-archiver/dist/public render-deploy/public
```

Folder `render-deploy/public/` będzie zawierał zbudowane pliki React.

## Krok 2: Wgraj folder `render-deploy/` na GitHub

1. Utwórz nowe repozytorium na GitHub.com
2. Wgraj zawartość folderu `render-deploy/` (NIE cały workspace — tylko ten folder).

## Krok 3: Utwórz usługę na Render.com

1. Zaloguj się na [render.com](https://render.com)
2. Kliknij **New +** → **Web Service**
3. Połącz swoje repozytorium GitHub
4. Ustaw:
   - **Name:** web-archiver (lub inna nazwa)
   - **Build Command:** `npm install && node build.mjs`
   - **Start Command:** `node --enable-source-maps dist/index.mjs`
5. Kliknij **Advanced** i dodaj zmienną środowiskową:
   - **DATABASE_URL** = (połączenie z bazą danych, patrz krok 4)

## Krok 4: Utwórz bazę danych PostgreSQL na Render.com

1. Na Render kliknij **New +** → **PostgreSQL**
2. Utwórz bazę z dowolną nazwą
3. Skopiuj **Internal Database URL** i wklej jako wartość `DATABASE_URL` w ustawieniach Web Service

## Krok 5: Pierwsza migracja bazy danych

Po pierwszym deploy, w zakładce **Shell** na Render.com uruchom:

```bash
npm run db:push
```

To stworzy tabele w bazie.

## Krok 6: Podłącz domenę hidenu.pl

1. W ustawieniach Web Service na Render kliknij **Custom Domains**
2. Dodaj `hidenu.pl` i `www.hidenu.pl`
3. W panelu swojego rejestratora domen (np. OVH, home.pl, Cloudflare) ustaw:
   - **CNAME** dla `www` → adres podany przez Render (np. `web-archiver.onrender.com`)
   - **A record** dla `@` (root domain) → IP podane przez Render

## Zmienne środowiskowe wymagane

| Zmienna | Opis |
|---|---|
| `DATABASE_URL` | URL połączenia z PostgreSQL |
| `PORT` | Port (automatycznie ustawiany przez Render) |

## Struktura folderu render-deploy/

```
render-deploy/
├── src/
│   ├── index.ts      # Serwer Express (API + serwowanie frontendu)
│   └── schema.ts     # Schemat bazy danych
├── public/           # Zbudowany React (skopiuj tu przed deployem)
├── package.json
├── build.mjs         # Skrypt budowania backendu
├── drizzle.config.ts
├── render.yaml       # Konfiguracja Render (opcjonalna)
└── README.md
```
