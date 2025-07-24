# Serverless Event Tracker

A lightweight serverless event-tracking system built with **AWS Chalice** (Python), **SQLAlchemy ORM**, and a modern vanilla JS frontend.  
Easily ingest, view, and summarize user events locally—no AWS account required.

---

## 🚀 Quick Start

1. **Clone and Run the Project**

   ```bash
   git clone <your-repo-url>
   cd serverless_tracking
   ./run.sh
   ```
   *(Or see "Manual Setup" below if you prefer to run steps individually)*

2. **Access the app:**
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **Frontend UI:** [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
serverless_tracking/
├── frontend/                     # Modern web UI (HTML, CSS, JS)
│     ├── index.html
│     ├── style.css
│     └── script.js
├── serverless_event_backend/     # Chalice API and backend logic
│     ├── app.py
│     ├── routes/
│     ├── models/
│     ├── services/
│     ├── schemas/
│     ├── requirements.txt
│     └── ...
├── venv/                         # Python virtual environment (auto-created)
├── run.sh                        # Quick setup and run script (Bash)
└── README.md                     # This file
```

---

## 🛠️ API Endpoints

### **1. `GET /`**
- Returns the API documentation frontend (HTML page).

### **2. `POST /events`**
- **Description:** Create a new event.
- **Request Body:**  
  ```json
  {
    "user_id": "123",
    "event_type": "click",
    "timestamp": "2025-07-24T12:00:00Z"
  }
  ```
- **Response:**  
  ```json
  { "message": "Event created" }
  ```

### **3. `GET /events`**
- **Description:** Get all events (most recent first).
- **Response:**  
  ```json
  {
    "events": [
      {
        "user_id": "123",
        "event_type": "click",
        "timestamp": "2025-07-24T12:00:00Z"
      },
      ...
    ]
  }
  ```

### **4. `GET /summary`**
- **Description:** Get count of events, optionally filter by `user_id` and/or `event_type`.
- **Query Params:** `user_id`, `event_type` (both optional)
- **Example:** `/summary?user_id=123&event_type=click`
- **Response:**  
  ```json
  { "total_events": 24 }
  ```

---

## 💻 Manual Setup

If you don’t use the script, you can run everything manually:

```bash
# Create venv if missing
python3 -m venv venv
source venv/bin/activate

# Install backend requirements
pip install -r serverless_event_backend/requirements.txt

# Start Chalice backend
cd serverless_event_backend
chalice local --port 8000
```

_Open a new terminal:_

```bash
cd frontend
python3 -m http.server 3000
```

---

## 🧪 Testing

To run backend unit tests (if provided):

```bash
pytest
```

---

## ℹ️ Notes

- **Database:** Uses local SQLite file (`events.db`).  
- **No authentication**: All endpoints are public by default for local demo/testing.
- **Stop services:** Use <kbd>Ctrl+C</kbd> to stop each process.  
- **Compatible with:** Python 3.9+.

---

## ✨ License

MIT License

---

## 👤 Author

Your Name – 2025
