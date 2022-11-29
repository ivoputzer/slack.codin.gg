FROM node:alpine
LABEL maintainer="Ivo von Putzer Reibegg <ivo.putzer@gmail.com>"

ENV NPM_CONFIG_LOGLEVEL error
ENV NPM_CONFIG_PRODUCTION true

WORKDIR /usr/src
COPY package.json package-lock.json ./

RUN npm install --no-optional --no-progress\
  && npm cache clean --force --silent

COPY ./ ./
EXPOSE 80

CMD npm start --slack-token=$SLACK_TOKEN --slack-secret=$SLACK_SECRET --openai-secret=$OPENAI_SECRET
