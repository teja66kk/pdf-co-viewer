import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { io } from 'socket.io-client';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PDFCoViewer.css';

// Connect to the Socket.io server
const socket = io('http://localhost:4000');

function PDFCoViewer() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [viewerCount, setViewerCount] = useState(1);
    const [notification, setNotification] = useState('');

    // Initialize the default layout plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        // Request admin status and viewer count when connecting
        socket.emit('get-status');

        // Listen for admin status changes
        socket.on('admin-set', (adminId) => {
            const isCurrentUserAdmin = adminId === socket.id;
            setIsAdmin(isCurrentUserAdmin);

            setNotification(
                adminId
                    ? isCurrentUserAdmin
                        ? 'You are now the Admin'
                        : 'An Admin is present'
                    : 'Viewing as a Viewer'
            );
        });

        // Sync the current page from the server
        socket.on('sync-page', (page) => {
            if (!isAdmin) {
                setCurrentPage(page);
            }
        });

        // Update viewer count
        socket.on('viewer-count', (count) => {
            setViewerCount(count);
        });

        // Cleanup listeners on component unmount
        return () => {
            socket.off('sync-page');
            socket.off('admin-set');
            socket.off('viewer-count');
        };
    }, [isAdmin]);

    // Handle page change (admin only)
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        socket.emit('change-page', newPage);
    };

    // Request to become admin
    const setAdmin = () => {
        socket.emit('set-admin');
    };

    return (
        <div className="pdf-co-viewer">
            <header className="header">
                <h2>PDF Co-Viewer</h2>
                <span className="status">
                    Viewing as: <strong>{isAdmin ? 'Admin' : 'Viewer'}</strong> | Viewers: {viewerCount}
                </span>
                {notification && <div className="notification">{notification}</div>}
            </header>

            <div className="controls">
                {!isAdmin && (
                    <button className="admin-button" onClick={setAdmin}>
                        Become Admin
                    </button>
                )}
            </div>

            <div className="viewer-container">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                        fileUrl="/sample.pdf"
                        plugins={[defaultLayoutPluginInstance]}
                        initialPage={currentPage - 1}
                        onPageChange={(e) => {
                            if (isAdmin) {
                                handlePageChange(e.currentPage + 1);
                            }
                        }}
                    />
                </Worker>
            </div>
        </div>
    );
}

export default PDFCoViewer;
