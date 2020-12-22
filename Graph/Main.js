var graph;
var parser;
var visual;
var daten;
var test;
//var startEingabe = "Beyond.Nadja\nBeyond.Tim\nBeyond.Felix\nBeyond.Lukas\nBeyond.Jannis\nBeyond.Laurenz\nBeyond.Konrad\n";

var startEingabe = "A\nA.L\nB\nC\nD\nE\nA-B\nD-B\nA-E\nE-C\nC-B\nE-B\nE-D\nD-A";

const testAktiviert = true;
const lokal = true;

function init () {
    daten = new Daten ();
    parser = new Parser ();
    graph = new Graph (); 
    visual = new Visual ();
}

function test_ausfuhren () {
    if (testAktiviert) {
        test = new Test (daten, parser, graph, visual);
        test.test ();
    }
}

function aktualisiereGraph () {
    graph = new Graph ();
    visual = new Visual ();
    parser.erstelleGraph (daten, graph);
    visual.zeichneGraph (graph);
    test_ausfuhren ();
}

$(document).ready(function (){
    init ();
    erstelleSubmitEventListener ();
    erstelleMenuEventListener ();

    if (lokal == false) {
        daten.leseVerzeichnisAus (true); 
    }
    
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

