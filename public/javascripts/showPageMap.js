mapboxgl.accessToken = mapToken;

const watchingspot = JSON.parse(ws);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: watchingspot.geometry.coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(watchingspot.geometry.coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({ offset: 20 })
    //         .setHTML(
    //             `<h6>${watchingspot.title}</h6>
    //             <p>${watchingspot.location}</p>`
    //         )
    // )
    .addTo(map)