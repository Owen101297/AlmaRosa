FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm@latest && mkdir -p artifacts/karen-guerrero

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib ./lib

RUN pnpm install

COPY artifacts/karen-guerrero ./artifacts/karen-guerrero

RUN cd artifacts/karen-guerrero && pnpm run build

EXPOSE 5173

CMD ["pnpm", "-r", "--filter", "@workspace/karen-guerrero", "run", "serve", "--host", "0.0.0.0"]