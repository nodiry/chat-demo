#!/bin/bash

set -e

# Run bun install for server
echo "📦 Installing dependencies for server..."
cd server
bun install

# Run bun install for client
echo "📦 Installing dependencies for client..."
cd ../client
bun install

# Start both server and client in parallel
echo "🚀 Starting both server and client..."

# Run server and client with logs separated
cd ../server && bun run dev &   # start server in background
SERVER_PID=$!
cd ../client && bun run dev &   # start client in background
CLIENT_PID=$!

# Wait for both to finish (keeps script running)
wait $SERVER_PID $CLIENT_PID
