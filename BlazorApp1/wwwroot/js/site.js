// wwwroot/js/leafletInterop.js

// Espera a que Leaflet (L) esté disponible
function waitForLeaflet(maxMs = 5000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        (function poll() {
            if (typeof window !== "undefined" && window.L) return resolve();
            if (Date.now() - start > maxMs) return reject(new Error("Leaflet no cargó (L indefinido)"));
            setTimeout(poll, 50);
        })();
    });
}

const store = {
    maps: new Map(), // mapId -> { map, layers: Map<string, L.Polyline[]> }
};

export async function init(divId, mapId, options) {
    await waitForLeaflet();

    const map = L.map(divId).setView([options.center.lat, options.center.lng], options.zoom ?? 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }).addTo(map);

    store.maps.set(mapId, { map, layers: new Map() });
}

export function addPolyline(mapId, coords, color, layerName) {
    const s = store.maps.get(mapId);
    if (!s) throw new Error(`Mapa '${mapId}' no inicializado`);

    const poly = L.polyline(coords, { color: color || "blue", weight: 4 }).addTo(s.map);
    if (!s.layers.has(layerName)) s.layers.set(layerName, []);
    s.layers.get(layerName).push(poly);
}

export function setLayerVisible(mapId, layerName, visible) {
    const s = store.maps.get(mapId);
    if (!s || !s.layers.has(layerName)) return;
    s.layers.get(layerName).forEach(pl => {
        if (visible) pl.addTo(s.map); else s.map.removeLayer(pl);
    });
}

export function fitToLayer(mapId, layerName) {
    const s = store.maps.get(mapId);
    if (!s || !s.layers.has(layerName) || s.layers.get(layerName).length === 0) return;
    const group = L.featureGroup(s.layers.get(layerName));
    s.map.fitBounds(group.getBounds());
}
