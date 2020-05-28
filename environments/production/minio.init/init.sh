#!/bin/sh

/usr/bin/mc config host add minio http://minio:9000 "${MINIO_ACCESS_KEY}" "${MINIO_SECRET_KEY}"
/usr/bin/mc mb -p minio/${COMPOSE_PROJECT_NAME}.local
/usr/bin/mc policy set public minio/${COMPOSE_PROJECT_NAME}.local
/usr/bin/mc mirror /minio.init/restore minio/${COMPOSE_PROJECT_NAME}.local --exclude .gitkeep