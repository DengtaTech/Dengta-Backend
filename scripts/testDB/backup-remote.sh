#!/bin/bash

if [ -f .env ]; then
    echo ".env file found"
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found"
fi

ssh -t ${REMOTE_USER}@${REMOTE_HOST} "sudo docker exec ${REMOTE_DB_CONTAINER} mysqldump --no-data -u ${DB_USER} -p'${DB_PASSWORD}' ${DB_NAME} > ${REMOTE_BACKUP_PATH}/backup.sql"

scp ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_BACKUP_PATH}/backup.sql ${LOCAL_BACKUP_PATH}/backup.sql

echo "Backup completed successfully and transferred to local path."
