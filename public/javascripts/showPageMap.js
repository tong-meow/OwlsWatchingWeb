mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: ws.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

new mapboxgl.Marker()
    .setLngLat(ws.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({ offset: 20 })
    //         .setHTML(
    //             `<h6>${watchingspot.title}</h6>
    //             <p>${watchingspot.location}</p>`
    //         )
    // )
    .addTo(map)