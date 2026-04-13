FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY lib ./lib

RUN pnpm install --frozen-lockfile

COPY artifacts/api-server/src ./artifacts/api-server/src
COPY artifacts/api-server/build.mjs ./artifacts/api-server/build.mjs
COPY artifacts/api-server/package.json ./artifacts/api-server/package.json

RUN cd artifacts/api-server && pnpm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "artifacts/api-server/dist/index.mjs"]