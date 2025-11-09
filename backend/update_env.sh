#!/bin/bash
# Update .env with MySQL connection
# Default: root user, no password, localhost, port 3306
# You can modify these values if your MySQL setup is different

DB_USER="${MYSQL_USER:-root}"
DB_PASS="${MYSQL_PASSWORD:-}"
DB_HOST="${MYSQL_HOST:-localhost}"
DB_PORT="${MYSQL_PORT:-3306}"
DB_NAME="diet_planner"

if [ -z "$DB_PASS" ]; then
  DATABASE_URL="mysql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
else
  DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

# Update .env file
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" .env
echo "Updated DATABASE_URL to: ${DATABASE_URL}"
