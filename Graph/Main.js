const TEST_MODE = true;
const RUNNING_IN_LOCAL = false;
var default_entry = "Shop\nKonstellation\nProjekte\nInfrastruktur\n\nShop.Software.Graph\nShop.Software.BAB_SE\nShop.Alben\nShop.Merch.Brille\nShop.Merch.Visitenoffner\nShop.Hardware.WeihnachtZauber\n\nProjekte.BeyHdl\nProjekte.TheAndAnd\nProjekte.WellTechnic\nProjekte.SoundCode\nProjekte.BAB\n\nKonstellation.Nadege\nKonstellation.Ella\nKonstellation.Laurenz\nKonstellation.Felix\nKonstellation.Tim\nKonstellation.Nadja\nKonstellation.Jannis\nKonstellation.Lukas\nKonstellation.Konrad\nKonstellation.Tobija\n\nInfrastruktur.Events.Festival\nInfrastruktur.Orte.Konstanz\nInfrastruktur.Orte.Leipzig\nInfrastruktur.Orte.Stuttgart\nInfrastruktur.Orte.Berlin\nInfrastruktur.Orte.Mainz\nInfrastruktur.Orte.Cotignac\nInfrastruktur.Orte.Belley\nInfrastruktur.Orte.Grendach\n\nKonstellation.Tobija-Projekte.SoundCode\nKonstellation.Konrad-Projekte.SoundCode\nKonstellation.Felix-Projekte.SoundCode\n\nKonstellation.Laurenz-Projekte.BeyHdl\nKonstellation.Felix-Projekte.BeyHdl\nKonstellation.Tim-Projekte.BeyHdl\nKonstellation.Nadja-Projekte.BeyHdl\nKonstellation.Jannis-Projekte.BeyHdl\nKonstellation.Lukas-Projekte.BeyHdl\nKonstellation.Konrad-Projekte.BeyHdl\n\n\nKonstellation.Laurenz-Projekte.BAB\nKonstellation.Felix-Projekte.BAB\nKonstellation.Konrad-Projekte.BAB\n\nKonstellation.Konrad-Projekte.TheAndAnd\n\nKonstellation.Nadege.1\nKonstellation.Nadege.2\nKonstellation.Ella.1\nKonstellation.Ella.2\nKonstellation.Laurenz.1\nKonstellation.Laurenz.2\nKonstellation.Felix.1\nKonstellation.Felix.2\nKonstellation.Tim.1\nKonstellation.Tim.2\nKonstellation.Nadja.1\nKonstellation.Nadja.2\nKonstellation.Jannis.1\nKonstellation.Jannis.2\nKonstellation.Lukas.1\nKonstellation.Lukas.2\nKonstellation.Konrad.1\nKonstellation.Konrad.2\nKonstellation.Tobija.1\nKonstellation.Tobija.2\n\nProjekte.SoundCode.Vol1\nProjekte.SoundCode.Vol2\nProjekte.BAB.Playlists.Vol1\nProjekte.BAB.Playlists.Vol2\nProjekte.BAB.Playlists.Vol3\nProjekte.BAB.Playlists.Vol4\nProjekte.BAB.Playlists.Vol5\nProjekte.BAB.Playlists.Vol6\nProjekte.BAB.Playlists.Vol7\n\nProjekte.BeyHdl.Alben\nProjekte.BeyHdl.Fotos\nProjekte.BeyHdl.Alben.1\nProjekte.BeyHdl.Alben.2\nProjekte.BeyHdl.SOW\nProjekte.BeyHdl.SOW-Konstellation.Nadege\n\nProjekte.TheAndAnd.WeissRegen\nProjekte.TheAndAnd.48\nShop.Alben.48\nProjekte.TheAndAnd.48-Shop.Alben.48\n"
//var default_entry = "A\nA.L\nB\nC\nD\nE\nA-B\nB-D\nA-E\nE-C\nC-B\nE-B\nE-D\nD-A\n>seq lukas A-B 2 B-D 3\n>pac lukas";
//var default_entry = "schnipsel3-schnipsel4\nschnipsel4-schnipsel1\n>seq hallo schnipsel2-schnipsel3 50 schnipsel3-schnipsel4 80 schnipsel4-schnipsel1 110 schnipsel2-schnipsel3 130\n";
//var default_entry = "agent.konradbogen\nagent.you\nagent.we\nverb.is\nverb.are\nquantity.a\nquantity.multiple\nquantity.the1221\nquantity.thefirst\nquantity.thelast\nnoun.visitor\nnoun.composer\nnoun.pirate\nnoun.cook\nnoun.observer\nnoun.speaker\nnoun.agent\nnoun.writer\nnoun.coder\nnoun.experientalist\nagent-verb\nverb-quantity\nquantity-noun\nagent-quantity\nnoun-agent\n>seq yellow agent-agent.konradbogen 12 agent.konrad-agent 12 agent-verb 12 verb-verb.is 12 verb.is-verb 12 verb-quantity 12 quantity-quantity.a 12 quantity.a-quantity 12 quantity-noun 12 noun-noun.composer 12\n>pac yellow\n>seq brown agent-agent.you 13 agent.you-agent 13 agent-verb 13 verb-verb.are 13 verb.are-verb 13 verb-quantity 13 quantity-quantity.the1221 13 quantity.the1221-quantity 13 quantity-noun 13\n>pac brown\n";
var graph;
var parser;
var visual;
var daten;
var test;
var ui_input_container;
var ui_graph_container;
var zoom;

$(document).ready(function (){
    init ();
});

function init () {
    create_ui();
    files = new FileSystem ();
    visual = new Visual (document.getElementById('graphContainer'));
    zoom.callbacks.push (visual.on_zoom_change.bind (visual));
    update_entry (default_entry);   
    if (RUNNING_IN_LOCAL == false) {
        files.lese_verzeichnis_aus (); 
    }
}

function create_ui() {
    ui_input_container = new UiInputContainer();
    ui_input_container.onSubmitClick = function (val) {
        parser.read_text(val);
        update_graph_visual();
    };
    ui_graph_container = new DragAndDrop('graphContainer');
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
    ui_input_container.textarea.value = eingabe;
    parser = new Parser ();
    parser.read_text (eingabe);
    update_graph_visual ();
}




