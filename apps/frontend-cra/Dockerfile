FROM node:current-alpine
ARG PORT
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --silent --production
COPY . ./
EXPOSE $PORT
CMD [ "npm", "start" ]
