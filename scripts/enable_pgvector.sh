#!/bin/bash
# Enable pgvector extension in PostgreSQL
# Run this when PostgreSQL is available

echo "Enabling pgvector extension..."

# Try different connection methods
if command -v docker &> /dev/null && docker ps | grep -q postgres; then
    echo "Using Docker..."
    docker exec -it $(docker ps -q -f name=postgres) psql -U mpn_user -d mpn_conductor -c "CREATE EXTENSION IF NOT EXISTS vector;"
elif command -v psql &> /dev/null; then
    echo "Using local psql..."
    psql -U mpn_user -d mpn_conductor -c "CREATE EXTENSION IF NOT EXISTS vector;"
else
    echo "PostgreSQL not found. Please run manually:"
    echo "psql -U mpn_user -d mpn_conductor -c \"CREATE EXTENSION IF NOT EXISTS vector;\""
    exit 1
fi

echo "Verifying pgvector..."
psql -U mpn_user -d mpn_conductor -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

echo "Running migration..."
psql -U mpn_user -d mpn_conductor -f scripts/setup_pgvector.sql

echo "✅ pgvector setup complete!"
