FROM node:14.17.1-alpine3.13 as building

# needed for git dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./src ./src

# we need specific npm version for git dependencies
RUN npm i -g npm@7.19.0
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:14.17.1-alpine3.13

WORKDIR /usr/src/app

COPY --from=building /usr/src/app/dist ./dist
COPY --from=building /usr/src/app/node_modules ./node_modules
COPY ./package*.json ./

CMD ["node", "./dist/index.js"]
