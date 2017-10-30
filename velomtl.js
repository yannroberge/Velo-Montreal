
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

                //Implémentation de l'autocomplétion
                var nomsStations = $.map(stations, function(station){ return station.Nom; });
                initAutocomplete(nomsStations);
                
                var stationsCherchable = {};
                $.map(stations, function(station){ stationsCherchable[station.Nom] = station; });
                updateTableau(stationsCherchable);

                // Crée la liste des stations
                $('#tableauListe').DataTable( {
                    language: {
                        url: "DataTables/table_fr_FR.json"
                    }
                });
                genererListe(stations);
                
                //$(".traduire").each( function() {
                    //traduire($(this));
                    // switch($(this)) {
                    //     case ""
                    //     traduire($(this.html()));
                    //     default:
                    //         alert($(this).html().concat(" n'a pas encore de traduction"));
                    // }
                //});
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
    //Met à jour le tableau d'informations lorsqu'un nom de station est entré dans la barre de recherche
    var barreRecherche = document.getElementById( "recherche" );
    
    barreRecherche.onchange = function () {
        var s = stations[barreRecherche.value];
        if(s != null){
            document.getElementById( "localisation" ).innerHTML = s.Nom;
        
            document.getElementById( "tableID" ).innerHTML = s.ID;
            document.getElementById( "tableBloquee" ).innerHTML = afficherBooleen(s.bloquee);
            document.getElementById( "tableSuspendue" ).innerHTML = afficherBooleen(s.suspendue);
            document.getElementById( "tableHorsService" ).innerHTML = afficherBooleen(s.horsService);
            document.getElementById( "tableVelosDispo" ).innerHTML = afficherNombreCouleur(s.velosDispo);
            document.getElementById( "tableBornesDispo" ).innerHTML = afficherNombreCouleur(s.bornesDispo);
            document.getElementById( "tableVelosInDispo" ).innerHTML = s.velosInDispo;
            document.getElementById( "tableBornesInDispo" ).innerHTML = s.bornesInDispo;
        }
    };
}

function genererListe(stations) {
    var x=[];
    var tableauListe = $("#tableauListe").DataTable();
    
    for(x in stations) {
        tableauListe.row.add( [
        stations[x].ID,
        stations[x].Nom,
        afficherNombreCouleur(stations[x].velosDispo),
        afficherNombreCouleur(stations[x].bornesDispo),
        afficherBooleen(stations[x].bloquee),
        afficherBooleen(stations[x].suspendue)
    ] )
    }
    tableauListe.draw();
}

function traduire(objet) {

}

function afficherBooleenCouleur(booleen) {
    //Retourne une balise HTML qui s'affiche comme un badge coloré avec le booléen donnée sous forme oui/non à l'intérieur
    //Sera rouge si true et vert si false
    var element = "";
    if(booleen) element = "<span class='badge badge-danger'>Oui</span>"
    else element = "<span class='badge badge-success'>Non</span>";
    return element;
}

function afficherNombreCouleur(valeur) {
    //Retourne une balise HTML qui s'affiche comme un badge coloré avec la valeur donnée à l'intérieur
    //Sera rouge si valeur = 0 et vert sinon
    var element = "";
    if(valeur == 0) element = "<span class='badge badge-danger'>" + valeur + "</span>"
    else element = "<span class='badge badge-success'>" + valeur + "</span>";
    return element;
}

