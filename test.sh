#!/bin/bash

log() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
    exit 1
}

log "Testing backend API..."
curl -s http://localhost:8000/getOrders || error "Backend API test failed!"

log "Testing frontend accessibility..."
curl -s http://localhost:4000 || error "Frontend test failed!"

log "All tests passed successfully!"