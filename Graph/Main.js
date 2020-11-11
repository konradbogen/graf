var graph;
var parser;
var visual;
var daten;
var test;
var startEingabe = "Beyond.Nadja\nBeyond.Tim\nBeyond.Felix\nBeyond.Lukas\nBeyond.Jannis\nBeyond.Laurenz\nBeyond.Konrad";

function init () {
    daten = new Daten ();
    parser = new Parser ();
    graph = new Graph (); 
    visual = new Visual ();
    test = new Test (daten, parser, graph, visual);
    test.test ();
}

function erstelleGraphAusEingabe (eingabe) {
    graph = new Graph ();
    visual = new Visual ();
    parser.erstelleGraph (eingabe, graph);
    visual.zeichneGraph (graph);
}

$(document).ready(function (){
    init ();
    erstelleSubmitEventListener ();
    erstelleMenuEventListener ();
    setzeEingabe (startEingabe);

});

function setzeEingabe (eingabe) {
    document.getElementById ("input").innerHTML = eingabe;
    erstelleGraphAusEingabe (eingabe);
}

function erstelleSubmitEventListener () {
    document.getElementById("submit").addEventListener("click", function() {
        var val = $.trim($("textarea").val());
          erstelleGraphAusEingabe (val);
      }, false);
      
}

function erstelleMenuEventListener () {
    $(".button").click(function() {
        $(".inputcontainer").toggleClass("faderight");
      
        });
    
    
}

