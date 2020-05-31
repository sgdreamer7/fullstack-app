FROM nginx:alpine
RUN apk --no-cache add curl
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
  chmod +x envsubst && \
  mv envsubst /usr/local/bin
COPY ./router.conf /etc/nginx/nginx.template
CMD ["/bin/sh", "-c", "export $(echo \"BLUE_GREEN_HOST=$(ip route show | awk '/default/ {print $3}')\" | xargs) && envsubst < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]