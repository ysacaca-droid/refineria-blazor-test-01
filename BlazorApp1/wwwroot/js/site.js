var map = null;

function initMap(mapId, lat, lon, zoom) {
    if (map !== null) {
        map.remove();
    }
    map = L.map(mapId).setView([lat, lon], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    window.map = map;
}

function drawMarker(lat, lon, popupText, iconUrl = null) {
    if (map === null) {
        console.error("El mapa no ha sido inicializado.");
        return;
    }

    let customIcon = iconUrl
        ? L.icon({
            iconUrl: iconUrl,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        })
        : undefined;

    L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupText);
}

function drawRoute(routePoints, color, weight, dashed = false) {
    if (map === null) {
        console.error("El mapa no ha sido inicializado.");
        return;
    }
    var polyline = L.polyline(routePoints, {
        color: color,
        weight: weight,
        opacity: 0.8,
        dashArray: dashed ? "10, 10" : null
    }).addTo(map);

    map.fitBounds(polyline.getBounds());
}

function clearLayers() {
    if (map !== null) {
        map.eachLayer(function (layer) {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }
}

function animateCar(routePoints, iconUrl) {
    if (map === null) return;

    let carIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    let marker = L.marker(routePoints[0], { icon: carIcon }).addTo(map);

    let i = 0;
    let interval = setInterval(() => {
        if (i >= routePoints.length) {
            clearInterval(interval);
            return;
        }
        marker.setLatLng(routePoints[i]);
        i++;
    }, 5000 / routePoints.length);
}

const puntos = [
    { name: "Sucre", lat: -19.04, lng: -65.25, tipo: "default" },
    { name: "Potosí", lat: -19.58, lng: -65.75, tipo: "customIcon" },
    { name: "La Paz", lat: -16.50, lng: -68.16, tipo: "divIcon" },
    { name: "Santa Cruz", lat: -17.78, lng: -63.18, tipo: "fontAwesome" }
];

function drawAllMarkers() {
    // Si el mapa no está inicializado, no hacer nada
    if (!window.map) return;

    // ✅ CORREGIDO: Las variables y la asignación de eventos están aquí adentro
    // Ahora es seguro obtener los elementos del DOM.
    const modal = document.getElementById('modal-container');
    const closeBtn = document.querySelector('.close-btn');

    // Asignar los eventos de los botones del modal. Verificamos que los elementos existan.
    if (closeBtn && modal) {
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Recorrer los puntos y dibujar cada marcador
    puntos.forEach(punto => {
        let marker;
        switch (punto.tipo) {
            case "default":
                marker = L.marker([punto.lat, punto.lng]);
                break;
            case "customIcon":
                const gasIcon = L.icon({
                    //iconUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233261.png',
                    iconUrl: 'custom-round-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                });
                marker = L.marker([punto.lat, punto.lng], { icon: gasIcon });
                break;
            case "divIcon":
                const divIcon = L.divIcon({
                    // className: 'my-custom-div-icon',
                    // html: '<div style="background-color: #ff5733; border-radius: 50%; border: 3px solid white;"></div>',
                    html: '<div style="background-color: #CBDF90; width:20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>',
                    iconSize: [20, 20],
                    //iconAnchor: [20, 20]
                });
                marker = L.marker([punto.lat, punto.lng], { icon: divIcon });
                break;
            case "fontAwesome":
                const faIcon = L.divIcon({
                    className: 'custom-icon',
                    html: '<div style="color: #007bff; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>',
                    iconAnchor: [12, 24]
                });
                marker = L.marker([punto.lat, punto.lng], { icon: faIcon });
                break;
        }

        if (marker) {
            marker.addTo(window.map);
            marker.on('click', function () {
                modal.style.display = 'block';
                document.getElementById('punto-nombre').value = punto.name;
                document.getElementById('punto-coordenadas').value = `${punto.lat}, ${punto.lng}`;
            });
        }
    });
}

function drawAllMarkersInput(drawPoint) {
    // Si el mapa no está inicializado, no hacer nada
    if (!window.map) return;

    // Asignar los eventos de los botones del modal. Verificamos que los elementos existan.
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.onclick = function () {
            const modalId = btn.getAttribute('data-modal-id');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
            }
        };
    });

    // Recorrer los puntos y dibujar cada marcador
    drawPoint.forEach(punto => {
        let marker;
        switch (punto.type) {
            case "default":
                const customPinIcon = L.divIcon({
                    className: 'leaflet-custom-pin',
                    html: '<svg viewBox="0 0 32 52" style="fill: #2ECC71; stroke: white; stroke-width: 2;"><path d="M16 0C7.16 0 0 7.16 0 16c0 10.3 16 36 16 36s16-25.7 16-36C32 7.16 24.84 0 16 0zM16 24c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
                    iconSize: [25, 41],
                    iconAnchor: [12.5, 41],
                    popupAnchor: [0, -38]
                });
                marker = L.marker([punto.latitude, punto.longitude], { icon: customPinIcon });
                break;
            case "customIcon":
                const gasIcon = L.icon({
                    iconUrl: punto.image,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                });
                marker = L.marker([punto.latitude, punto.longitude], { icon: gasIcon });
                break;
            case "divIcon":
                const divIcon = L.divIcon({
                    className: 'my-custom-div-icon',
                    //width: 20px; height: 20px;
                    html: '<div style="background-color: #ff5733; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white;"></div>',
                    //iconSize: [40, 40],
                    iconAnchor: [10, 10]
                });
                marker = L.marker([punto.latitude, punto.longitude], { icon: divIcon });
                break;
            case "fontAwesome":
                const faIcon = L.divIcon({
                    className: 'custom-icon',
                    html: '<div style="color: #007bff; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>',
                    iconAnchor: [12, 24]
                });
                marker = L.marker([punto.latitude, punto.longitude], { icon: faIcon });
                break;
        }

        if (marker) {
            marker.addTo(window.map);
            marker.on('click', function () {
                const modal = document.getElementById(punto.modalId);
                if (modal) {
                    modal.style.display = 'block';
                    // Aquí puedes llenar los datos del formulario si es necesario
                }
            });
        }
    });
}

function drawClusteredMarkers(points) {
    if (map === null) {
        console.error("drawClusteredMarkers: El mapa no ha sido inicializado.");
        return;
    }

    // 2. Verificar si la librería Leaflet.markercluster está disponible
    // Esta es la causa más común de tu error si L.markerClusterGroup es undefined.
    if (typeof L.markerClusterGroup === 'undefined') {
        console.error("drawClusteredMarkers: La librería Leaflet.markercluster no está cargada. Asegúrate de incluir 'leaflet.markercluster.js'.");
        return;
    }

    // Es una buena práctica limpiar los clústeres anteriores si esta función se llama varias veces.
    // Esto previene que se apilen múltiples capas de clusters.
    // Si ya tienes una función clearLayers más general, asegúrate de que también maneje MarkerClusterGroup.
    // O puedes eliminar el grupo de marcadores si ya existe:
    if (window.markerClusterLayer) {
        map.removeLayer(window.markerClusterLayer);
    }

    // 1. Crear un grupo de clusters
    var markers = L.markerClusterGroup({
        // 2. Definir una función para crear el ícono del cluster
        iconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();
            var c = ' my-marker-cluster-';
            // Asignar una clase CSS según el número de marcadores
            if (childCount < 10) {
                c += 'small'; // Menos de 10 marcadores: verde
            } else if (childCount < 100) {
                c += 'medium'; // Entre 10 y 99: amarillo
            } else {
                c += 'large'; // 100 o más: naranja
            }

            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40)
            });
        }
    });

    // 3. Recorrer los puntos y agregar cada marcador al grupo de clusters
    points.forEach(point => {
        var marker = L.marker([point.lat, point.lng]);
        marker.bindPopup(point.name);
        markers.addLayer(marker);
    });

    // 4. Agregar el grupo de clusters al mapa
    map.addLayer(markers);
}

function drawClusteredRoundMarkers(points) {
    if (map === null) {
        console.error("drawClusteredRoundMarkers: El mapa no ha sido inicializado.");
        return;
    }

    // Verificar si la librería está cargada
    if (typeof L.markerClusterGroup === 'undefined') {
        console.error("drawClusteredRoundMarkers: La librería Leaflet.markercluster no está cargada.");
        return;
    }

    // Eliminar clúster previo si existe
    if (window.roundMarkerClusterGroup) {
        map.removeLayer(window.roundMarkerClusterGroup);
    }

    // --- 1. Ícono individual (círculo azul claro) ---
    const individualRoundIcon = L.divIcon({
        className: 'custom-round-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });

    // --- 2. Grupo de clúster ---
    window.roundMarkerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 60,
        chunkedLoading: true,
        disableClusteringAtZoom: 16,

        iconCreateFunction: function (cluster) {
            const childCount = cluster.getChildCount();
            return new L.DivIcon({
                html: `<div><span>${childCount}</span></div>`,
                className: 'custom-cluster',
                iconSize: new L.Point(40, 40)
            });
        }
    });

    // --- 3. Agregar marcadores ---
    points.forEach(point => {
        if (point.lat !== undefined && point.lng !== undefined) {
            const marker = L.marker([point.lat, point.lng], { icon: individualRoundIcon });

            marker.bindPopup(
                `<b>${point.name || 'Punto de Interés'}</b><br>
                 Lat: ${point.lat}, Lng: ${point.lng}`
            );

            window.roundMarkerClusterGroup.addLayer(marker);
        }
    });

    // --- 4. Agregar al mapa ---
    map.addLayer(window.roundMarkerClusterGroup);

    if (points.length > 0) {
        map.fitBounds(window.roundMarkerClusterGroup.getBounds());
    }
}

//var map = null;

//// Función para inicializar el mapa Leaflet
//const modal = document.getElementById('modal-container');
//const closeBtn = document.querySelector('.close-btn');




//function initMap(mapId, lat, lon, zoom) {
//    if (map !== null) {
//        map.remove();
//    }
//    map = L.map(mapId).setView([lat, lon], zoom);

//    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//    }).addTo(map);

//    return map;
//}

//// NUEVA FUNCIÓN: Dibujar un marcador con un mensaje
//function drawMarker(lat, lon, popupText, iconUrl = null) {
//    if (map === null) {
//        console.error("El mapa no ha sido inicializado.");
//        return;
//    }

//    let customIcon = iconUrl
//        ? L.icon({
//            iconUrl: iconUrl,
//            iconSize: [30, 30],   // tamaño del icono
//            iconAnchor: [15, 30], // punto de anclaje
//            popupAnchor: [0, -30] // posición del popup relativo al icono
//        })
//        : undefined;

//    L.marker([lat, lon], { icon: customIcon })
//        .addTo(map)
//        .bindPopup(popupText);
//        //.openPopup();
//}

//// Función para dibujar una ruta con una polilínea
//function drawRoute(routePoints, color, weight, dashed = false) {
//    if (map === null) {
//        console.error("El mapa no ha sido inicializado.");
//        return;
//    }
//    var polyline = L.polyline(routePoints, {
//        color: color,
//        weight: weight,
//        opacity: 0.8,
//        dashArray: dashed ? "10, 10" : null
//    }).addTo(map);

//    map.fitBounds(polyline.getBounds());
//}

//// Función para limpiar todas las rutas y marcadores del mapa
//function clearLayers() {
//    if (map !== null) {
//        map.eachLayer(function (layer) {
//            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
//                map.removeLayer(layer);
//            }
//        });
//    }
//}

//// Función para cerrar el modal
//closeBtn.onclick = function () {
//    modal.style.display = 'none';
//}

//// Cierra el modal si se hace clic fuera del contenido
//window.onclick = function (event) {
//    if (event.target == modal) {
//        modal.style.display = 'none';
//    }
//}

//function animateCar(routePoints, iconUrl) {
//    if (map === null) return;

//    let carIcon = L.icon({
//        iconUrl: iconUrl,
//        iconSize: [40, 40],
//        iconAnchor: [20, 20]
//    });

//    let marker = L.marker(routePoints[0], { icon: carIcon }).addTo(map);

//    let i = 0;
//    let interval = setInterval(() => {
//        if (i >= routePoints.length) {
//            clearInterval(interval);
//            return;
//        }
//        marker.setLatLng(routePoints[i]);
//        i++;
//    }, 5000 / routePoints.length); // 5s de duración total
//}

//// Variable para el modal


//// Los 4 puntos que deseas dibujar
//const puntos = [
//    { name: "Sucre", lat: -19.04, lng: -65.25, tipo: "default" },
//    { name: "Potosí", lat: -19.58, lng: -65.75, tipo: "customIcon" },
//    { name: "La Paz", lat: -16.50, lng: -68.16, tipo: "divIcon" },
//    { name: "Santa Cruz", lat: -17.78, lng: -63.18, tipo: "fontAwesome" }
//];

//// Función para dibujar todos los marcadores en el mapa
//function drawAllMarkers() {
//    // Si el mapa no está inicializado, no hacer nada
//    if (!window.map) return;

//    puntos.forEach(punto => {
//        let marker;
//        switch (punto.tipo) {
//            case "default":
//                // Opción 1: Marcador por defecto de Leaflet
//                marker = L.marker([punto.lat, punto.lng]);
//                break;
//            case "customIcon":
//                // Opción 2: Icono personalizado (ej. un ícono de gas)
//                const gasIcon = L.icon({
//                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233261.png',
//                    iconSize: [40, 40],
//                    iconAnchor: [20, 40],
//                    popupAnchor: [0, -40]
//                });
//                marker = L.marker([punto.lat, punto.lng], { icon: gasIcon });
//                break;
//            case "divIcon":
//                // Opción 3: Icono basado en HTML/CSS (útil para etiquetas o formas)
//                const divIcon = L.divIcon({
//                    className: 'my-custom-div-icon',
//                    html: '<div style="background-color: #ff5733; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white;"></div>',
//                    iconAnchor: [15, 15]
//                });
//                marker = L.marker([punto.lat, punto.lng], { icon: divIcon });
//                break;
//            case "fontAwesome":
//                // Opción 4: Icono de Font Awesome (requiere que la librería esté en tu proyecto)
//                const faIcon = L.divIcon({
//                    className: 'custom-icon',
//                    html: '<div style="color: #007bff; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>',
//                    iconAnchor: [12, 24]
//                });
//                marker = L.marker([punto.lat, punto.lng], { icon: faIcon });
//                break;
//        }

//        // Añade el marcador al mapa y el evento de clic
//        if (marker) {
//            marker.addTo(window.map);
//            marker.on('click', function () {
//                // Muestra el modal
//                modal.style.display = 'block';
//                // Rellena el formulario
//                document.getElementById('punto-nombre').value = punto.name;
//                document.getElementById('punto-coordenadas').value = `${punto.lat}, ${punto.lng}`;
//            });
//        }
//    });
//}
