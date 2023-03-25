# 🐲 hoardr

A hoard of images. 

- `(pnpm|npm|yarn) install` will also generate Prisma bindings and create the db
- `start` script also runs `next build` so use `start:next` to skip that.

As far as `.env`, you can set:

- `NEXT_PUBLIC_UPLOAD_DIR` (default: `./static.local`) to the directory you wanna store the files
- `DATABASE_URL` (default: `file:./dev.local.db`) to tell Prisma where the SQLite db goes

---

Mostly a base for checking out the server components spec and learning I'm not really fond of `swr`.
