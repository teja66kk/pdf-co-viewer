# PDF Co-Viewer

This project implements a synchronized PDF viewer for multiple users. When an admin user changes the PDF page, it updates for all connected viewers, creating a seamless experience for presentations, remote teaching, or collaborative viewing.

## Features

- **Synchronized Viewing**: All users are on the same PDF page, controlled by the admin.
- **Admin Controls**: The admin user can navigate pages, and all viewers follow along in real-time.
- **Real-Time Updates**: Uses WebSocket technology for real-time page updates.

## Installation

### Prerequisites

- Node.js and npm
- Git
- Any modern browser

### Setup Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/teja66kk/pdf-co-viewer.git
   cd pdf-co-viewer

# Install Frontend Dependencies
cd frontend
npm install

# Install Backend Dependencies
cd ../backend
npm install

# Start Backend Server
npm start &
BACKEND_PID=$! # Store backend process ID

# Start Frontend Application (open a new terminal or run in background if needed)
cd ../frontend
npm start &
FRONTEND_PID=$! # Store frontend process ID

# Display Access Information
echo "Access the frontend at http://localhost:3000"
echo "Ensure the backend is running on http://localhost:4000 for real-time updates"

# Folder Structure
echo "
pdf-co-viewer/
├── frontend/             # Frontend code (React.js)
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/              # Backend code (Node.js + Express + Socket.io)
│   ├── src/
│   └── package.json
└── README.md
"

# Commands Cheat Sheet
echo "
Commands Cheat Sheet:
- Start Backend: npm start (from /backend)
- Start Frontend: npm start (from /frontend)

To push changes to GitHub:
git add .
git commit -m \"Initial commit\"
git push origin main
"

# Kill processes on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
