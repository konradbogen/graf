var graph;
var parser;
var visual;
var daten;
var test;
//var startEingabe = "Konstellation.Nadja\nKonstellation.Tim\nKonstellation.Felix\nKonstellation.Lukas\nKonstellation.Jannis\nKonstellation.Laurenz\nKonstellation.Konrad\n";
var startEingabe = "agent.konrad\nagent.you\nagent.we\nverb.is\nverb.are\nquantity.a\nquantity.multiple\nquantity.the1221\nquantity.thefirst\nquantity.thelast\nnoun.visitor\nnoun.composer\nnoun.pirate\nnoun.cook\nnoun.observer\nnoun.speaker\nnoun.agent\nnoun.writer\nnoun.coder\nnoun.experientalist\nagent-verb\nverb-quantity\nquantity-noun\nagent-quantity\nnoun-agent\n>seq yellow agent-agent.konrad 10 agent.konrad-agent 20 agent-verb 30 verb-verb.is 40 verb.is-verb 50 verb-quantity 60 quantity-quantity.a 70 quantity.a-quantity 80 quantity-noun 90 noun-noun.composer 100\n>pac yellow\n>seq brown agent-agent.you 15 agent.you-agent 30 agent-verb 45 verb-verb.are 60 verb.are-verb 75 verb-quantity 90 quantity-quantity.the1221 105 quantity.the1221-quantity 120 quantity-noun 135\n>pac brown\n";


//var startEingabe = "A\nA.L\nB\nC\nD\nE\nA-B\nB-D\nA-E\nE-C\nC-B\nE-B\nE-D\nD-A\n>seq lukas A-B 2 B-D 3\n>pac lukas";

const testAktiviert = true;
const lokal = false;

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

