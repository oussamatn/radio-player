#JoujmaFM Player Build APP

# build environment
FROM node:14-alpine as build

USER root
RUN rm -rf /home/node/joujmafm

RUN mkdir -p /home/node/joujmafm/node_modules && chown -R node:node /home/node/joujmafm

RUN apk update && apk add git


WORKDIR /home/node/joujmafm

ENV PATH /home/node/joujmafm/node_modules/.bin:$PATH

COPY package.json .

USER node

RUN npm i --production --silent

RUN npm install @vue/cli@3.7.0

COPY --chown=node:node . .

RUN npm run build

RUN rm -rf ./node_modules

FROM node:14-alpine as PROD

RUN npm install -g serve

WORKDIR /home/node/joujmafm

USER node
COPY --from=build --chown=node:node /home/node/joujmafm/dist ./dist

CMD serve -s dist -l 8080

# production environment
# TO be add
# RUN npm run prod
