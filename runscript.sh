#!/bin/bash

#chmod +x runscript.sh
#Aramex % ./runscript.sh
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
RESET="\033[0m"

set -e

log() {
    echo -e "${GREEN}[INFO]${RESET} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${RESET} $1"
}

error() {
    echo -e "${RED}[ERROR]${RESET} $1"
    exit 1
}

log "Building frontend Docker image ..."
(
    cd AramexFrontEnd || error "AramexFrontEnd directory not found!"
    docker build -t aramex-frontend . || error "Failed to build the frontend Docker image!"
    # docker run -d -p 4000:4000 aramex-frontend
)

log "starting the aramex-frontend container ..."
docker run -d -p 4000:4000 aramex-frontend || error "Failed to start the frontend container!"

log "Building backend image.."
(
    cd Backend || error "Backend directort not found!"
    docker build -t aramex-backend . || error "Failed to build the backend Docker image!"
    # docker run -d -p 8000:8000 -e MONGO_URL='mongodb+srv://mohamedsolimanfcai:Ashraf_123@aramex.6k45j.mongodb.net/?retryWrites=true&w=majority&appName=Aramex' aramex-backend
)

log "starting the aramex-backend container ..."
docker run -d -p 8000:8000 -e MONGO_URL='mongodb+srv://mohamedsolimanfcai:Ashraf_123@aramex.6k45j.mongodb.net/?retryWrites=true&w=majority&appName=Aramex' aramex-backend || error "Failed to start the backned container!"

log "Verifying each container status..."
docker ps --filter "name=aramex-*" || warn "Some containers may not be running as expected."

log "All containers are running. Access the application at http://localhost:4000"
log "Backend API is accessible at http://localhost:8000"
log "Whitelist your ip address in https://cloud.mongodb.com/v2/671b96bd77b36861cd688edf#/metrics/replicaSet/671b9771cd7fde58e4271c22/explorer/user_db/order_collection/find"