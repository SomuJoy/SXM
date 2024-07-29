FROM node:12.7 AS build

ARG NPM_TOKEN

RUN  mkdir -p /usr/src/app && chown node:node /usr/src/app
RUN  mkdir -p /usr/src/app/de-care && chown node:node /usr/src/app/de-care
RUN  mkdir -p /usr/src/app/de-care/node_modules && chown node:node /usr/src/app/de-care/node_modules

USER node

WORKDIR /usr/src/app/de-care

ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY --chown=node:node ./de-care/operations/.npmrc-docker ./.npmrc

COPY --chown=node:node ./de-care/package.json ./de-care/package-lock.json ./
