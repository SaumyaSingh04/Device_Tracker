const socket = io();
console.log("hey");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude }, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        },
        (error) => {
            console.error("Error getting location:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "OpenStreetmapBYSAUMYA"
}).addTo(map);

const markers = {};

// Function to add a small offset to coordinates

function addOffset(lat, lng, offset = 0.0001) {
    return [lat + Math.random() * offset - offset / 2, lng + Math.random() * offset - offset / 2];
}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    const [offsetLat, offsetLng] = addOffset(latitude, longitude);

    map.setView([latitude, longitude], 16);

    if (markers[id]) {
        markers[id].setLatLng([offsetLat, offsetLng]);
    } else {
        markers[id] = L.marker([offsetLat, offsetLng]).addTo(map);
    }
});

socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
