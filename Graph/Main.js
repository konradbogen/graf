const TEST_MODE = true;
const RUNNING_IN_LOCAL = false;
var default_entry_url = "Default.txt";
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
        set_entry_from_default_txt();
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
            return text;
        }
    };
    jsonFile.send();
}

function set_visual_callbacks () {
    visual.callback_create_from_graph = function () {
        zoom.reset_zoom();
        document.title = "heptagon." + visual.start_node.id;
        visual.connect_with_file_system(files);
    };
    zoom.callbacks.push (visual.on_zoom_change.bind (visual));
}

function create_ui() {
    ui_input_container = new UiInputContainer();
    ui_input_container.onSubmitClick = function (val) {
        parser.read_text(val);
        sessionStorage.setItem('graph_entry', val);
        update();
    };
    ui_graph_container = new DragAndDrop('graphContainer');
    zoom = new Zoom();
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




