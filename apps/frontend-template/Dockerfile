FROM node:current-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --silent --production
COPY . ./
EXPOSE 3000
CMD [ "npm", "start" ]
