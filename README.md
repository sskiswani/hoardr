# 🐲 hoardr

A hoard of images. Set `NEXT_PUBLIC_UPLOAD_DIR` to the directory you wanna store the files, and `DATABASE_URL` to tell Prisma where the SQLite db goes.

- `(pnpm|npm|yarn) install` will also generate Prisma bindings and create the db
- `start` script also runs `next build` so use `start:next` to skip that.

Mostly a starting point for checking out the server components spec and learning I'm not really fond of `swr`.
