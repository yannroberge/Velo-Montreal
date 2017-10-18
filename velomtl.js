
function initMap() {    
    var carte = new google.maps.Map(document.getElementById('div-map'), {
        center: {lat: 45.55, lng:-73.7},
        zoom: 10,
        minZoom: 10
    });
}

$(document).ready( function() {
    
    $.ajax('https://secure.bixi.com/data/stations.json',
        {
            success: function(data){

                var nomsStations = $.map(data.stations, function(station){ return station.s; });
                initAutocomplete(nomsStations);
            },
            error: function(){
                alert("Erreur lors du chargement des stations");
            }
        }
    );
       
});

function parseStations(stationBrute){
    var station = {
        "ID":stationBrute.n,
        "bloquee":stationBrute.b,
        "suspendue":stationBrute.su,
        "horsService":stationBrute.m,
        "velosDispo":stationBrute.ba,
        "bornesDispo":stationBrute.da,
        "velosInDispos":stationBrute.bx,
        "bornesInDispos":stationBrute.dx
    };
    return station;
}

function initAutocomplete(nomsStations){
    //Code tiré du tutoriel sur le widget Autocomplete de jQuery UI
    //http://jqueryui.com/autocomplete/#folding
    
    var accentMap = {
        //Cette partie est modifiée pour accomoder les lettres accentuées
        //présentes dans les noms de stations
        "à": "a",
        "â": "a",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ô": "o"
    };
    
    var normalize = function( term ) {
        var ret = "";
        for ( var i = 0; i < term.length; i++ ) {
          ret += accentMap[ term.charAt(i) ] || term.charAt(i);
        }
        return ret;
    };
    
    $( "#recherche" ).autocomplete({
        source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
        response( $.grep( nomsStations, function( value ) {
          value = value.label || value.value || value;
          return matcher.test( value ) || matcher.test( normalize( value ) );
        }) );
      }
    });
}

$(document).ready( function () {
    $('#tableauListe').DataTable( {
        language: {
            url: "DataTables/table_fr_FR.json"
        }
    });
} );
