#!/bin/bash
# Frontend only development server (no backend)
# Run: chmod +x dev-frontend-only.sh && ./dev-frontend-only.sh

echo "Starting React frontend only (no backend)..."
echo "Frontend will be available at http://localhost:5000"
echo "Note: API calls will fail without a backend running"
npx vite --host 0.0.0.0 --port 5000
