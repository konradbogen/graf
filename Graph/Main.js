const TEST_MODE = true;
const RUNNING_IN_LOCAL = false;
//var default_entry = "Konstellation.Nadja\nKonstellation.Tim\nKonstellation.Felix\nKonstellation.Lukas\nKonstellation.Jannis\nKonstellation.Laurenz\nKonstellation.Konrad\n";
//var default_entry = "A\nA.L\nB\nC\nD\nE\nA-B\nB-D\nA-E\nE-C\nC-B\nE-B\nE-D\nD-A\n>seq lukas A-B 2 B-D 3\n>pac lukas";
//var default_entry = "schnipsel3-schnipsel4\nschnipsel4-schnipsel1\n>seq hallo schnipsel2-schnipsel3 50 schnipsel3-schnipsel4 80 schnipsel4-schnipsel1 110 schnipsel2-schnipsel3 130\n";
var default_entry = "agent.konradbogen\nagent.you\nagent.we\nverb.is\nverb.are\nquantity.a\nquantity.multiple\nquantity.the1221\nquantity.thefirst\nquantity.thelast\nnoun.visitor\nnoun.composer\nnoun.pirate\nnoun.cook\nnoun.observer\nnoun.speaker\nnoun.agent\nnoun.writer\nnoun.coder\nnoun.experientalist\nagent-verb\nverb-quantity\nquantity-noun\nagent-quantity\nnoun-agent\n>seq yellow agent-agent.konradbogen 12 agent.konrad-agent 12 agent-verb 12 verb-verb.is 12 verb.is-verb 12 verb-quantity 12 quantity-quantity.a 12 quantity.a-quantity 12 quantity-noun 12 noun-noun.composer 12\n>pac yellow\n>seq brown agent-agent.you 13 agent.you-agent 13 agent-verb 13 verb-verb.are 13 verb.are-verb 13 verb-quantity 13 quantity-quantity.the1221 13 quantity.the1221-quantity 13 quantity-noun 13\n>pac brown\n";
var graph;
var parser;
var visual;
var daten;
var test;
var uiInputContainer;
var uiGraphContainer
var zoom;

$(document).ready(function (){
    init ();
});

function init () {
    create_ui();
    files = new FileSystem ();
    visual = new Visual (zoom.zoomElement);
    zoom.callbacks.push (visual.on_zoom_change);
    update_entry (default_entry);   
    if (RUNNING_IN_LOCAL == false) {
        files.lese_verzeichnis_aus (); 
    }
}

function create_ui() {
    uiInputContainer = new UiInputContainer();
    uiInputContainer.onSubmitClick = function (val) {
        parser.read_text(val);
        update_graph_visual();
    };
    uiGraphContainer = new DragAndDrop('graphContainer');
    zoom = new Zoom();
}

function update_graph_visual () {
    graph = new Graph ();
    parser.create_graph (graph);
    visual.create_from_graph (graph);
    visual.connect_with_file_system (files);
    /* pacs = new PACSystem (visual);
    parser.create_all_sequences (pacs);
    parser.create_all_pacs (pacs);
    pacs.show_all_sequences (); */
}

function update_entry (eingabe) {
    uiInputContainer.textarea.innerHTML = eingabe;
    parser = new Parser ();
    parser.read_text (eingabe);
    update_graph_visual ();
}




