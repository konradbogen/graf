const TEST_MODE = true;
const RUNNING_IN_LOCAL = false;
var default_entry_url = "Default.txt";
const RECORD_COMMAND = "_record";
const PLAY_COMMAND = "_play";
const PAUSE_COMMAND = "_pause";
const RESET_COMMAND = "_reset";


var graph;
var parser;
var visual;
var daten;
var test;
var ui_input_container;
var ui_graph_container;
var zoom_container;

$(document).ready(function (){
    init ();
});

function init () {
    files = new FileSystem ();
    visual = new Visual (document.getElementById('graphContainer'));
    create_ui();
    set_visual_callbacks();
    if (RUNNING_IN_LOCAL == false) {
        files.read_directory (); 
    }
    load_default_entry ();
}


function set_entry (input) {
    ui_input_container.textarea.value = input;
    sessionStorage.setItem('graph_entry', input);
    parser = new Parser ();
    parser.read_text (input);
    update ();
}

function update () {
    graph = new Graph ();
    parser.create_graph (graph);
    update_visual();
    init_pacsystem();
}

function load_default_entry () {
    var stored_entry = sessionStorage.getItem('graph_entry');
    if (stored_entry) {
        set_entry (stored_entry);   
    }else {
        if (!RUNNING_IN_LOCAL) {
            set_entry_from_default_txt();
        }else {
            set_entry ("running\nin\nlocal")
        }
    }
}

function set_entry_from_default_txt () {
    var jsonFile = new XMLHttpRequest();
    jsonFile.open("GET", default_entry_url, true);
    jsonFile.onreadystatechange = function () {
        if (jsonFile.readyState == 4 && jsonFile.status == 200) {
            this.default_entry = jsonFile.responseText;
            console.log("Default Entry From File: " + this.default_entry);
            set_entry(files.get_all_ids_entry_text() + "\n" + this.default_entry);
        }
    };
    jsonFile.send();
}

function set_visual_callbacks () {
    visual.callback_create_from_graph = function () {
        zoom_container.reset_zoom();
        update_document_title ();
        visual.connect_with_file_system(files);
    };
    set_command_node_callbacks();
    zoom_container.callbacks.push (visual.on_zoom_change.bind (visual));
}

function set_command_node_callbacks() {
    visual.callbacks_point_play.push(function (point) {
        if (point.node.name == RECORD_COMMAND) {
            pacs.start_recording ();
        }else if (point.node.name == PLAY_COMMAND) {
            pacs.play_recorded ();
        }else if (point.node.name == PAUSE_COMMAND) {
            pacs.stop_all_pacs ();
        }else if (point.node.name == RESET_COMMAND) {
            pacs.delete_all_pacs ();
            pacs.init_recorded_sequence ();
        }
    });
    visual.callbacks_point_stop.push(function (point, duration) {
        if (point.node.name == RECORD_COMMAND) {
            pacs.stop_recording ();
        }else if (point.node.name == PAUSE_COMMAND) {
            pacs.start_all_pacs ();
        }
    });
}

function update_document_title () {
    if (visual.start_node) {
        document.title = "heptagon." + visual.start_node.id;
    }else {
        document.title = "heptagon";
    }
}

function create_ui() {
    ui_input_container = new InputContainer();
    ui_input_container.onSubmitClick = function (val) {
        parser.read_text(val);
        sessionStorage.setItem('graph_entry', val);
        update();
    };
    ui_input_container.onMuteChange = function (val) {
        if (val) {
            visual.mute();
        }else {
            visual.init_audio ();
            visual.unmute();
        }
    }
    zoom_container = new ZoomContainer();
}

window.onpopstate = function (e) {
    var stored_entry = sessionStorage.getItem('graph_entry');
    set_entry (stored_entry); 
}

function init_pacsystem() {
    pacs = new PACSystem(visual);
    parser.create_all_sequences(pacs);
    parser.create_all_pacs(pacs);
    pacs.show_all_sequences();
}

function update_visual() {
    var url_passed_start_node = get_url_parameter("sub");
    if (!url_passed_start_node) {
        url_passed_start_node = get_url_parameter("s");
    }
    visual.start_node = graph.find_node(url_passed_start_node);
    visual.create_from_graph(graph, visual.start_node);
}

 function get_url_parameter (name, w){
    w = w || window;
    var rx = new RegExp('[\&|\?]'+name+'=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? null:val[1];
}




