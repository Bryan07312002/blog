#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <name>"
  exit 1
fi

script_dir=$(dirname "$(readlink -f "$BASH_SOURCE")")

save_path="${script_dir}/../src/persistence/database/migrations"

mkdir -p "$save_path"

current_date=$(date +%Y%m%d)

filename="${current_date}_${1}.ts"

full_path="${save_path}/${filename}"

cat <<EOF > "$full_path"
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
EOF

echo "File created: $full_path"
