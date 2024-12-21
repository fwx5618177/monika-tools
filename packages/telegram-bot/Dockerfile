FROM node:20.10.0 AS build
WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile

EXPOSE 3000

CMD [ "npm", "run", "start" ]
