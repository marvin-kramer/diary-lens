#!/bin/bash

set -o errexit
set -o errtrace
set -o pipefail
set -o nounset
set -o xtrace

docker build -t ghcr.io/marvin-kramer/diary-lens/frontend:latest .
docker push ghcr.io/marvin-kramer/diary-lens/frontend:latest