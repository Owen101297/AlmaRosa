FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY lib ./lib

RUN pnpm install --frozen-lockfile

COPY artifacts/api-server ./artifacts/api-server

RUN cd artifacts/api-server && pnpm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "artifacts/api-server/dist/index.mjs"]