#!/bin/sh
cp /usr/src/app/router.conf /etc/nginx/nginx.template
envsubst < /etc/nginx/nginx.template > /etc/nginx/nginx.conf
if (nginx -t); then nginx -s reload; fi