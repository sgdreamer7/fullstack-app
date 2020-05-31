#!/bin/sh
cp /usr/src/app/router.conf /etc/nginx/nginx.template
export $(echo "BLUE_GREEN_HOST=$(ip route show | awk '/default/ {print $3}')" | xargs)
envsubst < /etc/nginx/nginx.template > /etc/nginx/nginx.conf
if (nginx -t); then nginx -s reload; fi