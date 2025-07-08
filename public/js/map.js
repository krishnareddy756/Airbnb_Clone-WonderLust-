

mapboxgl.accessToken = mapToken;
    // Initialize the Mapbox map 
mapboxgl.accessToken = 'pk.eyJ1IjoicmlzaGlndXB0aGE0NSIsImEiOiJjbTd0Y25nNHYxdTY1MmtyNmIzNmM0aGJiIn0.liKVGNziX-P5f3F80ZfYxQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: 'red' }) // Create a new marker with a red color
    .setLngLat(listing.geometry.coordinates) // Set the
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${listing.title}</h3><p>Exact Location</p>`))
     // Add a popup to the marker
    .addTo(map); // Add the marker to the map


