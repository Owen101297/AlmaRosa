FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY lib ./lib

RUN pnpm install --frozen-lockfile

COPY artifacts/karen-guerrero ./artifacts/karen-guerrero

RUN cd artifacts/karen-guerrero && pnpm run build

ENV NODE_ENV=production
EXPOSE 5173

CMD ["node", "artifacts/karen-guerrero/node_modules/vite/bin/vite.js", "preview", "--host", "0.0.0.0", "--port", "5173"]