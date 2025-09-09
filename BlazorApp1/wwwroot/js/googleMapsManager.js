// Variable global para la instancia del mapa de Google
var map = {};
var markers = [];
var polylines = [];

var animatedMarker = null;
var animationInterval = null;
var animationIntervalPolyline = null;

// Función de callback que la API de Google Maps llama al cargarse
function initMap() {
    console.log("Google Maps API cargada. No se inicializa el mapa todavía.");
}

function animatePolyline(routePoints, lineColor, lineThickness) {
    // 1. Limpiar cualquier animación anterior
    if (animationIntervalPolyline) {
        clearInterval(animationIntervalPolyline);
        animationIntervalPolyline = null;
    }

    // 2. Crear una polilínea vacía que se irá dibujando
    const animatedPolyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: lineColor,
        strokeOpacity: 0.8,
        strokeWeight: lineThickness,
        map: map
    });
    polylines.push(animatedPolyline);

    // 3. Iniciar la animación
    let i = 0;
    const path = routePoints.map(p => ({ lat: p[0], lng: p[1] }));
    const intervalDuration = 400 / path.length; // Duración por segmento para que el total sea 400ms

    animationIntervalPolyline = setInterval(() => {
        if (i >= path.length) {
            clearInterval(animationIntervalPolyline);
            animationIntervalPolyline = null;
            return;
        }

        // Agregar el nuevo punto a la polilínea
        const newPath = animatedPolyline.getPath();
        newPath.push(path[i]);
        animatedPolyline.setPath(newPath);

        // Incrementar el índice para el siguiente punto
        i++;
    }, intervalDuration); // <-- ¡Cambio aquí!
}

//function animateRoute(elementId, routePoints, lineColor, lineThickness) {
//    const map = map[elementId];
//    if (!map) {
//        console.error("Mapa no encontrado: " + elementId);
//        return;
//    }

//    // Limpiar animaciones anteriores
//    if (animationIntervals[elementId]) {
//        clearInterval(animationIntervals[elementId]);
//        animationIntervals[elementId] = null;
//    }
//    if (animatedMarkers[elementId]) {
//        animatedMarkers[elementId].setMap(null);
//    }

//    // Crear carrito
//    const carIcon = {
//        url: "/image/cart.png",
//        scaledSize: new google.maps.Size(30, 30),
//        anchor: new google.maps.Point(15, 15)
//    };
//    const marker = new google.maps.Marker({
//        position: { lat: routePoints[0][0], lng: routePoints[0][1] },
//        map: map,
//        icon: carIcon
//    });
//    animatedMarkers[elementId] = marker;

//    // Crear polilínea
//    const animatedPolyline = new google.maps.Polyline({
//        path: [],
//        geodesic: true,
//        strokeColor: lineColor,
//        strokeOpacity: 0.8,
//        strokeWeight: lineThickness,
//        map: map
//    });
//    polylines[elementId].push(animatedPolyline);

//    // Animación
//    let i = 0;
//    const path = routePoints.map(p => ({ lat: p[0], lng: p[1] }));

//    animationIntervals[elementId] = setInterval(() => {
//        if (i >= path.length) {
//            clearInterval(animationIntervals[elementId]);
//            return;
//        }
//        marker.setPosition(path[i]);
//        const newPath = animatedPolyline.getPath();
//        newPath.push(path[i]);
//        animatedPolyline.setPath(newPath);
//        i++;
//    }, 800);
//}

function animateRoute(routePoints, lineColor, lineThickness) {
    // 1. Limpiar cualquier animación anterior
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    if (animatedMarker) {
        animatedMarker.setMap(null);
        animatedMarker = null;
    }

    // 2. Crear un nuevo marcador con el ícono del carrito
    const carIcon = {
        url: "/image/cart.png",
        scaledSize: new google.maps.Size(30, 30), // Ajusta el tamaño del carrito
        anchor: new google.maps.Point(15, 15) // Centra el ancla del ícono
    };
    animatedMarker = new google.maps.Marker({
        position: { lat: routePoints[0][0], lng: routePoints[0][1] },
        map: map,
        icon: carIcon,
        title: "Vehículo en ruta"
    });

    // 3. Crear una polilínea vacía que se irá dibujando
    const animatedPolyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: lineColor,
        strokeOpacity: 0.8,
        strokeWeight: lineThickness,
        map: map
    });
    polylines.push(animatedPolyline);

    // 4. Iniciar la animación
    let i = 0;
    const path = routePoints.map(p => ({ lat: p[0], lng: p[1] }));

    animationInterval = setInterval(() => {
        if (i >= path.length) {
            clearInterval(animationInterval);
            animationInterval = null;
            return;
        }

        // Actualizar la posición del carrito
        animatedMarker.setPosition(path[i]);

        // Agregar el nuevo punto a la polilínea
        const newPath = animatedPolyline.getPath();
        newPath.push(path[i]);
        animatedPolyline.setPath(newPath);

        // Incrementar el índice para el siguiente punto
        i++;
    }, 800); // Ajusta este valor para cambiar la velocidad de la animación (en milisegundos)
}

// Función para inicializar el mapa en un contenedor específico
//function createMap(elementId, centerLat, centerLng, zoom) {
//    const mapElement = document.getElementById(elementId);
//    if (!mapElement) {
//        console.error("El elemento con ID " + elementId + " no se encontró.");
//        return;
//    }

//    const newMap = new google.maps.Map(mapElement, {
//        zoom: zoom,
//        center: { lat: centerLat, lng: centerLng },
//        styles: [
//            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
//            { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] }
//        ]
//    });

//    map[elementId] = newMap;
//    markers[elementId] = [];
//    polylines[elementId] = [];
//}
function createMap(elementId, centerLat, centerLng, zoom) {
    const mapElement = document.getElementById(elementId);
    if (!mapElement) {
        console.error("El elemento con ID " + elementId + " no se encontró.");
        return;
    }

    map = new google.maps.Map(mapElement, {
        zoom: zoom,
        center: { lat: centerLat, lng: centerLng },
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "on" } // Nombres de departamentos/ciudades (visibles)
                ]
            },
            {
                "featureType": "poi", // Puntos de interés (parques, etc.)
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" } // Ocultar etiquetas de puntos de interés
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" } // Ocultar nombres de calles
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels",
                "stylers": [
                    { "visibility": "off" } // Ocultar nombres de transporte
                ]
            }
        ]
    });
}

// Función para limpiar el mapa
function clearMap() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];

    for (let i = 0; i < polylines.length; i++) {
        polylines[i].setMap(null);
    }
    polylines = [];
}

// Función para dibujar una polilínea
function drawPolyline(routePoints, color, thickness) {
    const polyline = new google.maps.Polyline({
        path: routePoints.map(p => ({ lat: p[0], lng: p[1] })),
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: thickness,
        map: map
    });
    polylines.push(polyline);
}

// Función para dibujar un marcador con un punto grueso
function drawDotMarker(lat, lng, label, color) {
    const dotIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        //fillColor: '#C0C0C0', // Plomo suave
        fillColor: '#fff', // Plomo suave
        fillOpacity: 1,
        // strokeColor: '#505050', // Color del borde: gris
        strokeColor: '#fff', // Color del borde: gris
        strokeWeight: 1, // Grosor del borde: 1 punto
        scale: 0, // Tamaño del punto (puedes ajustarlo)
    };

    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: label,
        icon: dotIcon
    });
    markers.push(marker);

    const infowindow = new google.maps.InfoWindow({
        content: `<b>${label}</b>`
    });
    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });
}

// Función para dibujar una polilínea segmentada (con puntos)
function drawDottedLine(routePoints, color, thickness) {
    const polyline = new google.maps.Polyline({
        path: routePoints.map(p => ({ lat: p[0], lng: p[1] })),
        strokeColor: color, // Este color se usará para los segmentos si se definen con stroke
        strokeOpacity: 0, // Opacidad de la línea base, la ponemos en 0
        strokeWeight: 0, // Grosor de la línea base, la ponemos en 0
        icons: [{
            icon: {
                // Usamos FORWARD_CLOSED_ARROW pero lo ajustamos para que parezca un guion
                path: google.maps.SymbolPath.CIRCLE,
                scale: thickness, // Hacemos el "segmento" más corto
                strokeColor: color, // Color del guion
                fillColor: color, // Relleno del guion
                fillOpacity: 1,
                strokeWeight: 1, // Un pequeño borde para definir mejor el guion
                rotation: 0, // No rotamos la flecha, porque el path ya la orienta correctamente
                anchor: new google.maps.Point(thickness * 0.5, 0) // Centrar el guion
            },
            offset: '0',
            repeat: `${thickness * 5}px` // Espaciado entre los guiones, relacionado con el grosor
        }],
        map: map
    });
    polylines.push(polyline);
}

function addRefineryMarker() {
    const refineryLocation = { lat: -17.8698111, lng: -63.2022197 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Guillermo Elder Bell",
        icon: {
            url: "/image/refineria-01.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(50, 50), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Guillermo Elder Bell</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addRefineryCochabamba() {
    const refineryLocation = { lat: -17.450870, lng: -66.124339 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/refineria-01.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(50, 50), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addFluvialGuayaramerin() {
    const refineryLocation = { lat: -10.82, lng: -65.37 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/fluvial-01.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(40, 40), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addFluvialTrinidad() {
    const refineryLocation = { lat: -14.83, lng: -64.90 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/fluvial-01.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(40, 40), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addFluvialVillarroel() {
    const refineryLocation = { lat: -16.89, lng: -64.75 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/fluvial-01.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(40, 40), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraSanjose() {
    const refineryLocation = { lat: -16.89, lng: -64.75 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/fluvial-01.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(40, 40), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraVillamontes() {
    const refineryLocation = { lat: -21.26, lng: -63.46 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraMonteagudo() {
    const refineryLocation = { lat: -19.79, lng: -63.99 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraTrinidad() {
    const refineryLocation = { lat: -14.83, lng: -64.90 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraSucre() {
    const refineryLocation = { lat: -19.04, lng: -65.25 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraPotosi() {
    const refineryLocation = { lat: -19.57, lng: -65.75 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraBermejo() {
    const refineryLocation = { lat: -22.75, lng: -64.33 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraVillazon() {
    const refineryLocation = { lat: -22.05, lng: -65.59 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraTupiza() {
    const refineryLocation = { lat: -21.45, lng: -65.71 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraUyuni() {
    const refineryLocation = { lat: -20.46, lng: -66.82 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraSenkata() {
    const refineryLocation = { lat: -16.57, lng: -68.18 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function addCarreteraOruro() {
    const refineryLocation = { lat: -17.9514032, lng: -67.1355149 };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: "Refinería Gualberto Villarroel",
        icon: {
            url: "/image/gasolina-04.png",  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: "<b>Refinería Gualberto Villarroel</b><br>Ubicación: Santa Cruz, Bolivia"
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}

function drawIconoImage(latitud, longitud, pathImage, title, content, ) {
    const refineryLocation = { lat: latitud, lng: longitud };

    // Usar el ícono personalizado desde wwwroot/images/100.png
    const marker = new google.maps.Marker({
        position: refineryLocation,
        map: map,
        title: title,
        icon: {
            url: pathImage,  // Ruta a la imagen en wwwroot
            scaledSize: new google.maps.Size(28, 28), // Ajusta el tamaño del ícono
        }
    });

    // Crear la ventana de información que aparece al hacer clic en el marcador
    const infoWindow = new google.maps.InfoWindow({
        content: content
    });

    // Asociar la ventana de información al marcador
    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
}