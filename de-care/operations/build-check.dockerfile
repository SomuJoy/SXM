FROM angular-dev:latest

ARG NODE_VARS=""

RUN npm run $NODE_VARS
