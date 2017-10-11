
function initMap() {    
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.55, lng:-73.7},
        zoom: 10
    });
    
    
    $.ajax('https://secure.bixi.com/data/stations.json',
        {
            success: function(data){
                var bixi = data
                var mark = new google.maps.Marker({
                    position: {lat: data.stations[0].la, lng: data.stations[0].lo},
                    map: map
                })
            },
            error: function(jqXHR, status, error){
                alert(error);
            }
        }
    );
}
