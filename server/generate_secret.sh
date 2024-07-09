#!/bin/bash
# Generate a random secret key
ACCESS_TOKEN_SECRET=$(openssl rand -hex 32)
# Create the .env file with the generated secret
echo "ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}" > /app/.env
