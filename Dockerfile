FROM node:20-alpine

LABEL maintainer="https://suk.kr"

ENV TZ=Asia/Seoul

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate 

RUN yarn run build

CMD ["yarn", "run", "start:prod"]