const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Variables to track viewers, current page, and admin status
let viewers = [];
let currentPage = 1;
let adminId = null;

// Serve static files (for the React frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html (React build)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle new socket connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Add the new viewer to the viewers array
    viewers.push(socket.id);
    io.emit('viewer-count', viewers.length);

    // Sync the current page with the newly connected viewer
    socket.emit('sync-page', currentPage);

    // Notify the new viewer of the current admin status
    socket.emit('admin-set', adminId);

    // Listen for page change events from the admin
    socket.on('change-page', (page) => {
        if (socket.id === adminId) {
            currentPage = page;
            console.log(`Admin changed page to: ${page}`);
            io.emit('sync-page', currentPage);
        }
    });

    // Handle admin assignment request
    socket.on('set-admin', () => {
        if (adminId === null) { // Only set admin if no admin exists
            adminId = socket.id;
            console.log(`New admin assigned: ${adminId}`);
            io.emit('admin-set', adminId);
        } else {
            socket.emit('admin-set', adminId);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        viewers = viewers.filter((id) => id !== socket.id);
        io.emit('viewer-count', viewers.length);

        // If the admin disconnects, reset the adminId
        if (socket.id === adminId) {
            adminId = null;
            console.log(`Admin has left, no admin currently assigned.`);
            io.emit('admin-set', null); // Notify users that no admin is currently assigned
        }
    });
});

// Start the server on port 4000
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
