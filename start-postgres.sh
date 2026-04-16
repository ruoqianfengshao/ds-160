#!/bin/bash
set -e

echo "Starting PostgreSQL..."
sudo service postgresql start
sleep 2

echo "Checking PostgreSQL status..."
sudo service postgresql status || true

echo "Creating database and user if not exists..."
sudo -u postgres psql -c "CREATE USER ds160_user WITH PASSWORD 'ds160_password';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "CREATE DATABASE ds160_helper OWNER ds160_user;" 2>/dev/null || echo "Database already exists"

echo "Initializing tables..."
POSTGRES_URL="postgresql://ds160_user:ds160_password@localhost:5432/ds160_helper" node init-db.mjs

echo "✅ PostgreSQL ready!"
