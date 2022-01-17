mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-103.5917, 40.6699],
    zoom: 3
});
 
map.on('load', () => {
    map.addSource('watchingspots', {
        type: 'geojson',
        data: watchingspots,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });
 
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'watchingspots',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#80CBC4',
                10,
                '#4DB6AC',
                20,
                '#009688'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                10,
                20,
                20,
                30
            ]
        }
    });
    
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'watchingspots',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
    
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'watchingspots',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    
    // inspect a cluster on click
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
    });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('watchingspots').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
                
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });
    
    map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const text = e.features[0].properties.popUpMarkup;
        
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
    
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(text)
        .addTo(map);
    });
    
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});