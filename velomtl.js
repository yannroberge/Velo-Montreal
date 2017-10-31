
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
                
                $("#boutonLangue").click(function() {
                    if ($("html").attr("lang") == "fr") {
                        $(this).html("<i class=\"fa fa-globe\" aria-hidden=\"true\"></i> Français");
                        $("html").attr("lang","en");
                        $(".traduire").each(function() {
                            $(this).html(traduireEn($(this).html() ) );
                        });
                        var tableauListe = $('#tableauListe').DataTable();
                        tableauListe.clear();
                        tableauListe.destroy();
                        $('#tableauListe').DataTable( {
                            language: {
                                url: "DataTables/table_en_EN.json"
                            }
                        });
                        genererListe(stations);
                    }
                    else {
                        // Rafraîchir la page, ce qui remet le site en Français
                        location.reload();
                    }
                });
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
            document.getElementById( "tableBloquee" ).innerHTML = afficherBooleenCouleur(s.bloquee);
            document.getElementById( "tableSuspendue" ).innerHTML = afficherBooleenCouleur(s.suspendue);
            document.getElementById( "tableHorsService" ).innerHTML = afficherBooleenCouleur(s.horsService);
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
        afficherBooleenCouleur(stations[x].bloquee),
        afficherBooleenCouleur(stations[x].suspendue)
    ] )
    }
    tableauListe.draw();
}

function afficherBooleenCouleur(booleen) {
    //Retourne une balise HTML qui s'affiche comme un badge coloré avec le booléen donnée sous forme oui/non à l'intérieur
    //Sera rouge si true et vert si false
    var element = "";
    if ($("html").attr("lang") == "en") {
        if(booleen) element = "<span class='badge badge-danger traduire'>Yes</span>"
        else element = "<span class='badge badge-success traduire'>No</span>";
    }
    else {
        if(booleen) element = "<span class='badge badge-danger traduire'>Oui</span>"
        else element = "<span class='badge badge-success traduire'>Non</span>";
    }
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

function traduireEn(texteFr) {
    var tableDeTraductionEn = {
        "Vélo Montréal": "Biking Montréal",
        "Accueil": "Home",
        "Carte des stations": "Stations map",
        "Liste des stations": "Stations list",
        "Localisation:": "Location",
        "État de la station": "Station status",
        "ID station": "Station ID",
        "Vélos disponibles": "Available bikes",
        "Bloquée": "Blocked",
        "Bornes disponibles": "Available terminals",
        "Suspendue": "On hold",
        "Vélos indisponibles": "Unavailable bikes",
        "Hors service": "Out of service",
        "Bornes indisponibles": "Unavailable terminals",
        "État de toutes les stations de vélos": "Status for all biking stations",
        "ID": "ID",
        "Nom station": "Station name",
        "Bornes disponibles": "Available terminals",
        "Oui": "Yes",
        "Non": "No",
    };
    if(tableDeTraductionEn[texteFr]) {
        return tableDeTraductionEn[texteFr];
    }
    else {
        // Avertit le développeur si un élément à traduire dans le site n'a pas de traduction dans tableDeTraductionEn
        //alert("Pas de traduction trouvée pour \"".concat(texteFr).concat("\""));
        return texteFr;
    }
}
