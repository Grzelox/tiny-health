#!/bin/sh
set -eu

for database in "$POSTGRES_DB" "$POSTGRES_SHADOW_DB"; do
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$database" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOSQL
done
