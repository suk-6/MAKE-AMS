!/bin/sh

docker-compose down

docker-compose up -d postgres

npx prisma generate

DATABASE_URL="postgresql://db:db@localhost:5432/db?schema=public" npx prisma migrate dev

docker-compose up -d --build