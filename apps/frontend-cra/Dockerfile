FROM node:current-alpine
ARG PORT
ARG REACT_APP_CURRENT_STATE
ENV REACT_APP_CURRENT_STATE $REACT_APP_CURRENT_STATE
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --silent --production
COPY . ./
EXPOSE $PORT
CMD [ "npm", "start" ]
