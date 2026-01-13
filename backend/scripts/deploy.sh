#!/bin/bash

echo "Stopping existing containers..."
docker compose --profile staging down

VOLUME_NAME="ai-tool-hub-backend_postgres_data"

echo "🧹 Removing Docker volume: $VOLUME_NAME"
docker volume rm $VOLUME_NAME || echo "⚠️  Volume $VOLUME_NAME not found or already removed"

echo "Rebuilding and starting containers..."
docker compose --profile staging up -d --build