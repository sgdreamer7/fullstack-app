FROM nginx:alpine
RUN apk --no-cache add curl
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
  chmod +x envsubst && \
  mv envsubst /usr/local/bin
COPY ./router.conf /etc/nginx/nginx.template
COPY ./wait-for-http /etc/nginx/wait-for-http
COPY ./get-host /etc/nginx/get-host
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
