#!/bin/bash

# Development Helper Script
# Clears cache if needed and starts dev server

echo "🧹 Checking for stale cache..."

# Check if .next directory has issues
if [ -d ".next" ]; then
    # Check if cache is old (more than 1 day)
    CACHE_AGE=$(find .next -type f -mtime +1 | wc -l)
    if [ "$CACHE_AGE" -gt 0 ]; then
        echo "⚠️  Cache is older than 1 day, clearing..."
        rm -rf .next
    fi
fi

echo "🚀 Starting development server..."
npm run dev
