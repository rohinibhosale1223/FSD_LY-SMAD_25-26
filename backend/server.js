const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// =========================================================================
// CRITICAL FIX: CORS CONFIGURATION
// This allows your frontend (http://localhost:3000) to connect to the backend (port 5000)
// =========================================================================
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware needed to handle JSON POST requests from the UserScreen
app.use(express.json());

// =========================================================================
// 1. Data Stores
// =========================================================================

// Store for police monitors (Shivajinagar example)
const policeMonitors = [
    { 
        id: 'P_SHIVAJINAGAR', 
        name: 'Shivajinagar Police Station', 
        lat: 18.5303, // Police Station Location
        lng: 73.8446, 
        socketId: null, 
        notifiedRequests: new Set() 
    },
];

// Store for active ambulance requests
const activeRequests = {}; 

const NOTIFICATION_THRESHOLD_KM = 2; // 2 km radius for proximity alert

// =========================================================================
// 2. Haversine Distance Calculation (Helper Function)
// =========================================================================

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const toRad = (angle) => (angle * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in km
}

// =========================================================================
// 3. Core Geo-Fencing Logic
// =========================================================================

function checkAmbulanceProximity(driverId, ambulanceLocation) {
    const request = activeRequests[driverId];
    if (!request || !request.isDispatched) return;

    const { lat: ambLat, lng: ambLng } = ambulanceLocation;
    const requestId = driverId; 

    for (const monitor of policeMonitors) {
        if (!monitor.socketId) continue; 

        // If this alert has already been sent for this request, skip it
        if (monitor.notifiedRequests.has(requestId)) {
            continue; 
        }

        const distanceKM = haversineDistance(
            ambLat, ambLng, 
            monitor.lat, monitor.lng
        );

        if (distanceKM <= NOTIFICATION_THRESHOLD_KM) {
            
            // --- ALERT TRIGGERED! ---
            io.to(monitor.socketId).emit('ambulanceApproaching', {
                message: `URGENT! Ambulance ${driverId} is ${distanceKM.toFixed(2)} km away from your area, requiring a green corridor!`,
                ambulancePosition: ambulanceLocation,
                driverId: driverId,
                requestInfo: {
                    requestId: requestId,
                    userLocation: request.userLocation
                }
            });

            monitor.notifiedRequests.add(requestId); 
            
            console.log(`[ALERT] Notified ${monitor.name} (Police) for Ambulance ${driverId}. Distance: ${distanceKM.toFixed(2)} km.`);
        }
    }
}


// =========================================================================
// 4. API Endpoints (HTTP Request Handler)
// =========================================================================

app.post('/api/request-ambulance', (req, res) => {
    // This is the endpoint called by the UserScreen
    const { location: locationString, condition, userSocketId } = req.body;
    
    // Parse the location string: "Lat: 18.x, Lng: 73.x" -> { lat: 18.x, lng: 73.x }
    const [latStr, lngStr] = locationString.split(', ').map(s => s.split(': ')[1]);
    const userLocation = { lat: parseFloat(latStr), lng: parseFloat(lngStr) };
    
    // Simulate initial dispatch details
    const driverId = 'AMB-D001'; 
    const driverPosition = { lat: 18.5375, lng: 73.8825 }; // Driver start location (Hospital)

    // Store the request
    activeRequests[driverId] = { 
        userLocation, 
        userSocketId, 
        condition,
        driverLocation: driverPosition,
        isDispatched: true,
    };

    // 1. Notify the User that the ambulance is dispatched
    // io.to(userSocketId).emit is safe because the user is already connected via socket.io
    io.to(userSocketId).emit('notification', {
        message: `Ambulance ${driverId} dispatched! ETA ~15 min.`,
        type: 'dispatched',
        driverPosition: driverPosition,
        userDestination: userLocation 
    });
    
    console.log(`[REQUEST] New request received. Assigned: ${driverId} (User Socket ID: ${userSocketId})`);
    res.status(200).send({ message: 'Request received and dispatched.' });
});

// =========================================================================
// 5. Socket.IO Handlers
// =========================================================================

io.on('connection', (socket) => {
    // --- Police Monitor Registration ---
    socket.on('registerMonitor', (data) => {
        if (data.type === 'police') {
            const monitor = policeMonitors.find(m => 
                m.lat === data.location.lat && m.lng === data.location.lng
            );
            if (monitor) {
                monitor.socketId = socket.id;
                console.log(`Police Monitor registered: ${monitor.name} (Socket ID: ${socket.id})`);
            }
        }
    });

    // --- Driver Location Update (Emitted by DriverScreen) ---
    socket.on('driverLocationUpdate', (data) => {
        const request = activeRequests[data.driverId];
        if (request) {
            request.driverLocation = { lat: data.lat, lng: data.lng };

            // Broadcast the location to the UserScreen 
            io.to(request.userSocketId).emit('ambulanceLocation', { lat: data.lat, lng: data.lng });

            // Run the critical Geo-Fencing check
            checkAmbulanceProximity(data.driverId, request.driverLocation);
        }
    });

    // --- Disconnect Handler ---
    socket.on('disconnect', () => {
        const monitor = policeMonitors.find(m => m.socketId === socket.id);
        if (monitor) {
            monitor.socketId = null;
            console.log(`Police Monitor deregistered: ${monitor.name}`);
        }
    });
});


// =========================================================================
// 6. Start Server
// =========================================================================

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Connect React app at http://localhost:3000`);
});