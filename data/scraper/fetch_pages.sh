#!/bin/bash
# Unduh halaman produk selka.id (AC split saja) ke folder pages/
set -u
cd "$(dirname "$0")"
mkdir -p pages
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

n=0
while read -r url; do
  [ -z "$url" ] && continue
  slug=$(basename "$url" .html)
  out="pages/${slug}.html"
  if [ -s "$out" ]; then continue; fi
  code=$(curl -sL -A "$UA" --compressed -m 45 -o "$out" -w "%{http_code}" "$url")
  n=$((n+1))
  echo "[$n] $code  $slug"
  sleep 1
done < "$1"
