var graph;
var parser;
var visual;
var daten;
var test;
//var startEingabe = "Beyond.Nadja\nBeyond.Tim\nBeyond.Felix\nBeyond.Lukas\nBeyond.Jannis\nBeyond.Laurenz\nBeyond.Konrad\n";

var startEingabe = "A\nA.L\nB\nC\nD\nE\nA-B\nB-D\nA-E\nE-C\nC-B\nE-B\nE-D\nD-A\n>seq lukas A-B 2 B-D 3\n>pac lukas";

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

function aktualisiere_graph () {
    graph = new Graph ();
    visual = new Visual ();
    parser.erstelle_graph (daten, graph);
    visual.zeichneGraph (graph);
    parser.erstelle_alle_sequenzen (daten, graph, visual);
    parser.erstelle_alle_pacs (daten, visual);
    visual.zeichne_sequenzen ();
    test_ausfuhren ();
}

$(document).ready(function (){
    init ();
    erstelle_submit_event_listener ();
    erstelle_menu_event_listener ();

    if (lokal == false) {
        daten.lese_verzeichnis_aus (true); 
    }
    
    var text = startEingabe + daten.erstelle_eingabe_text ()
    andere_eingabe (text);
    aktualisiere_graph ();
});

function andere_eingabe (eingabe) {
    document.getElementById ("input").innerHTML = eingabe;
    daten.lese_eingabe_aus (eingabe);
}



function erstelle_submit_event_listener () {
    document.getElementById("submit").addEventListener("click", function() {
        var val = $.trim($("textarea").val());
          daten.lese_eingabe_aus (val);
          aktualisiere_graph ();
      }, false);
      
}

function erstelle_menu_event_listener () {
    $(".button").click(function() {
        $(".inputcontainer").toggleClass("faderight");
      
        });
    
    
}

