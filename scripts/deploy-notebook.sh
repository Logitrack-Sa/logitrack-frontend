#!/usr/bin/env bash
# Ejecutar desde el checkout obtenido de GitHub. No contiene credenciales.
set -euo pipefail
source_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$source_dir"
expected=${1:?Indicar el commit revisado}
actual=$(git rev-parse HEAD)
[ "$actual" = "$expected" ] || { echo "El checkout no coincide con el commit solicitado"; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "El checkout tiene cambios locales"; exit 1; }
image="logitrack-notebook-frontend:${actual:0:12}"
docker build --network=host --build-arg NEXT_PUBLIC_API_GATEWAY_URL=/logitrack --build-arg NEXT_PUBLIC_BASE_PATH=/logitrack -t "$image" .
cd /srv/apps/logitrack
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="backups/frontend-$stamp"
mkdir -m 700 "$backup"
cp compose.yaml images.json sources.json "$backup/"
python3 - "$image" <<'PYCODE'
import json,sys
p='compose.yaml';c=json.load(open(p));c['services']['frontend']['image']=sys.argv[1];open(p,'w').write(json.dumps(c,indent=2)+'\n')
PYCODE
if ! docker compose up -d --no-deps --wait --wait-timeout 180 frontend; then
 cp "$backup/compose.yaml" compose.yaml
 docker compose up -d --no-deps --wait --wait-timeout 180 frontend
 exit 1
fi
python3 - "$actual" "$image" <<'PYCODE'
import json,sys,subprocess
p='sources.json';s=json.load(open(p));s['logitrack-frontend']=sys.argv[1];open(p,'w').write(json.dumps(s,indent=2)+'\n')
p='images.json';s=json.load(open(p));s['frontend']={'image':sys.argv[2],'id':subprocess.check_output(['docker','image','inspect',sys.argv[2],'--format','{{.Id}}'],text=True).strip()};open(p,'w').write(json.dumps(s,indent=2)+'\n')
PYCODE
printf 'Frontend desplegado desde GitHub: %s\n' "$actual"
