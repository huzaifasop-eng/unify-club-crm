FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY apps/web/package.json ./apps/web/package.json
WORKDIR /app/apps/web
RUN npm install

FROM base AS build
WORKDIR /app/apps/web
COPY --from=deps /app/apps/web/node_modules ./node_modules
COPY apps/web ./
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app/apps/web
COPY --from=build /app/apps/web/public ./public
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
