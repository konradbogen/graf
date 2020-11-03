var graph;
var parser;
var visual;
var daten;
var test;

function init () {
    daten = new Daten ();
    parser = new Parser ();
    graph = new Graph (); 
    visual = new Visual ();
    test = new Test (daten, parser, graph, visual);
}

$(document).ready(function (){
    init ();
    parser.erstelleGraph (test.testDaten2, graph);
    visual.zeichneGraph (graph);
    test.test ();
});



