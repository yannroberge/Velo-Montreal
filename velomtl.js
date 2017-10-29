
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
                var stations = parseStations(data.stations);

                // var nomsStations = $.map(data.stations, function(station){ return station.s; });
                // initAutocomplete(nomsStations);

                var nomsStations = $.map(stations, function(station){ return station.Nom; });
                initAutocomplete(nomsStations);
                
                var stationsCherchable = {};
                $.map(stations, function(station){ stationsCherchable[station.Nom] = station; });
                updateTableau(stationsCherchable);

                $('#tableauListe').DataTable( {
                    language: {
                        url: "DataTables/table_fr_FR.json"
                    }
                });
                genererListe(stations);
            },
            error: function(){
                alert("Erreur lors du chargement des stations");
            }
        }
    );
       
});

function parseStations(stationsBrutes){

    var stations = [];
    var x = [];
    var i=0;
    // alert(stationsBrutes[i].n);
    
    for(x in stationsBrutes) {
        stations[i] = {
            "ID":stationsBrutes[x].n,
            "Nom":stationsBrutes[x].s,
            "bloquee":stationsBrutes[x].b,
            "suspendue":stationsBrutes[x].su,
            "horsService":stationsBrutes[x].m,
            "velosDispo":stationsBrutes[x].ba,
            "bornesDispo":stationsBrutes[x].da,
            "velosInDispo":stationsBrutes[x].bx,
            "bornesInDispo":stationsBrutes[x].dx
        };
        
        i++;
    }
    return stations;
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


function updateTableau(stations){
    var barreRecherche = document.getElementById( "recherche" );
    
    barreRecherche.onchange = function () {
        var s = stations[barreRecherche.value];
        if(s != null){
            document.getElementById( "tableID" ).innerHTML = s.ID;
            document.getElementById( "tableBloquee" ).innerHTML = boolVersFrancais(s.bloquee);
            document.getElementById( "tableSuspendue" ).innerHTML = boolVersFrancais(s.suspendue);
            document.getElementById( "tableHorsService" ).innerHTML = boolVersFrancais(s.horsService);
            document.getElementById( "tableVelosDispo" ).innerHTML = s.velosDispo;
            document.getElementById( "tableBornesDispo" ).innerHTML = s.bornesDispo;
            document.getElementById( "tableVelosInDispo" ).innerHTML = s.velosInDispo;
            document.getElementById( "tableBornesInDispo" ).innerHTML = s.bornesInDispo;
        }
    };
}

function genererListe(stations) {
    var x=[];
    var tableauListe = $("#tableauListe").DataTable();
    stations[4].bloquee = true;
    for(x in stations) {
        tableauListe.row.add( [
        stations[x].ID,
        stations[x].Nom,
        stations[x].velosDispo,
        stations[x].bornesDispo,
        afficherBooleen(stations[x].bloquee),
        afficherBooleen(stations[x].suspendue)
    ] ).draw();
    }
}

function afficherBooleen(booleen) {
    var ouiOuNon = "";
    if(booleen) ouiOuNon = "<span class='badge badge-danger'>Oui</span>"
    else ouiOuNon = "<span class='badge badge-success'>Non</span>";
    return ouiOuNon;
}

function boolVersFrancais(x){
    return x ? "Oui":"Non";
}

