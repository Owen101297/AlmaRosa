FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY lib ./lib
COPY artifacts/api-server/package.json ./artifacts/api-server/package.json
COPY artifacts/karen-guerrero/package.json ./artifacts/karen-guerrero/package.json

RUN pnpm install --frozen-lockfile

COPY artifacts/karen-guerrero/index.html ./artifacts/karen-guerrero/index.html
COPY artifacts/karen-guerrero/public ./artifacts/karen-guerrero/public
COPY artifacts/karen-guerrero/src ./artifacts/karen-guerrero/src
COPY artifacts/karen-guerrero/tsconfig.json ./artifacts/karen-guerrero/tsconfig.json
COPY artifacts/karen-guerrero/vite.config.ts ./artifacts/karen-guerrero/vite.config.ts

RUN cd artifacts/karen-guerrero && pnpm run build

ENV NODE_ENV=production
EXPOSE 5173

CMD ["node", "artifacts/karen-guerrero/node_modules/vite/bin/vite.js", "preview", "--host", "0.0.0.0", "--port", "5173"]