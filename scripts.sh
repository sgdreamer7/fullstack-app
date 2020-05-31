#!/bin/sh
RUNNING_ENVIRONMENT="development"
case "$2" in
  "dev")
        RUNNING_ENVIRONMENT="development"
      ;;
   "prod")
      RUNNING_ENVIRONMENT="production"
     ;;
   "staging")
      RUNNING_ENVIRONMENT="staging"
     ;;
    "test")
      RUNNING_ENVIRONMENT="test"
     ;;
esac
echo "Running in the '${RUNNING_ENVIRONMENT}' environment:"
cd environments/${RUNNING_ENVIRONMENT} && \
ENV_VARS="$(cat .env | xargs)" && \
# echo "1: ${ENV_VARS}\n" && \
export $(echo ${ENV_VARS} | xargs) && \
ENV_VARS="${ENV_VARS} COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME_PREFIX}${COMPOSE_PROJECT_NAME}" && \
if test $CURRENT_STATE; then  ENV_VARS="${ENV_VARS} CURRENT_STATE=${CURRENT_STATE} $(cat $(echo .env.${CURRENT_STATE}) | xargs)"; else ENV_VARS="${ENV_VARS} CURRENT_STATE=blue"; fi && \
# echo "2: ${ENV_VARS}\n" && \
if [ "$CURRENT_STATE" == "green" ]; then ENV_VARS="${ENV_VARS} NGINX_PORT=${GREEN_PORT} BLUE_GREEN_PORT=${GREEN_PORT}"; \
elif [ "$CURRENT_STATE" == "blue" ]; then ENV_VARS="${ENV_VARS} NGINX_PORT=${BLUE_PORT} BLUE_GREEN_PORT=${BLUE_PORT} "; \
else ENV_VARS="${ENV_VARS} NGINX_PORT=${BLUE_PORT} BLUE_GREEN_PORT=${BLUE_PORT} "; fi && \
# echo "3: ${ENV_VARS}\n" && \
export $(echo ${ENV_VARS} | xargs) && \
echo "Running command: $1 $3 $4 $5 $6 $7 $8 $9 "
$1 $3 $4 $5 $6 $7 $8 $9 