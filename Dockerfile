#JoujmaFM Player Build APP

# build environment
FROM node:12.2.0-alpine as build
RUN npm -v

USER root

# non-root user node
RUN mkdir -p /home/node/joujmafm/node_modules && chown -R node:node /home/node/joujmafm


RUN apk update && apk add git

RUN which git

WORKDIR /home/node/joujmafm

ENV PATH /home/node/joujmafm/node_modules/.bin:$PATH

COPY package.json .
RUN npm install -g serve

USER node

RUN npm install


RUN npm install @vue/cli@3.7.0

COPY --chown=node:node . .

RUN npm run build

CMD serve -s dist -l 8080

# production environment
# TO be add
# RUN npm run prod
