#!/bin/bash

set -e

# 1. Go to project root (adjust if needed)
cd "$(dirname "$0")"

# 2. Set up Python venv if missing
if [ ! -d "venv" ]; then
    echo "🔹 Creating virtual environment..."
    python3 -m venv venv
fi

# 3. Activate venv
source venv/bin/activate

# 4. Install backend requirements
echo "🔹 Installing requirements..."
pip install -r serverless_event_backend/requirements.txt

# 5. Start Chalice backend (on port 8000)
echo "🔹 Starting Chalice backend at http://localhost:8000 ..."
(cd serverless_event_backend && chalice local --port 8000) &

# 6. Start frontend (on port 3000)
echo "🔹 Starting frontend at http://localhost:3000 ..."
cd frontend
python3 -m http.server 3000

# 7. Instructions
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"