

function initMap() {    
    var bixi = $.ajax('https://secure.bixi.com/data/stations.json', {dataType: "json"});
    
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.55, lng:-73.7 },
        zoom: 10
    });
    
    var mark = new google.maps.Marker({
        position: {lat: bixi.stations[0].la, lng: bixi.stations[0].lo},
        map: map
    });
}
