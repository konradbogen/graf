var graph;
var parser;
var visual;
var daten;
var test;
var startEingabe = "Beyond.Nadja\nBeyond.Tim\nBeyond.Felix\nBeyond.Lukas\nBeyond.Jannis\nBeyond.Laurenz\nBeyond.Konrad\n";

function init () {
    daten = new Daten ();
    parser = new Parser ();
    graph = new Graph (); 
    visual = new Visual ();
    test = new Test (daten, parser, graph, visual);
}

function aktualisiereGraph () {
    graph = new Graph ();
    visual = new Visual ();
    parser.erstelleGraph (daten, graph);
    visual.zeichneGraph (graph);
}

$(document).ready(function (){
    init ();
    erstelleSubmitEventListener ();
    erstelleMenuEventListener ();

    daten.leseVerzeichnisAus (true);
    var text = startEingabe + daten.kriegeEingabeText ()
    setzeEingabe (text);

    aktualisiereGraph ();
});

function setzeEingabe (eingabe) {
    document.getElementById ("input").innerHTML = eingabe;
    daten.leseEingabeAus (eingabe);
}



function erstelleSubmitEventListener () {
    document.getElementById("submit").addEventListener("click", function() {
        var val = $.trim($("textarea").val());
          daten.leseEingabeAus (val);
          aktualisiereGraph ();
      }, false);
      
}

function erstelleMenuEventListener () {
    $(".button").click(function() {
        $(".inputcontainer").toggleClass("faderight");
      
        });
    
    
}

