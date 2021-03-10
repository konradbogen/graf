const TEST_MODE = true;
const RUNNING_IN_LOCAL = false;

const PALETTE = [
    '#004F2D',
    '#247BA0',
    '#e6af2e',
    '#F76F8E',
    '#550C18',
    '#3B429F']; //in # and ' for anime.js compatibility; 

var default_entry_url = "/Stored/Default.txt";

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
    visual.connect_with_file_system(files);
    load_default_entry ();
}


function set_entry (input) {
    ui_input_container.textarea.innerText = input;
    sessionStorage.setItem('graph_entry', input);
    parser = new Parser ();
    parser.read_text (input);
    update ();
}

function update () {
    graph = new Graph ();
    parser.create_graph (graph);
    update_visual();
    destroyAllStreamPeers ();
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
            set_entry(files.get_all_ids_entry_text() + "\n" + this.default_entry);
        }
    };
    jsonFile.send();
}

function set_visual_callbacks () {
    visual.callback_create_from_graph = function () {
        zoom_container.reset_zoom();
        update_document_title ();
    };
    set_command_node_callbacks();
    zoom_container.callbacks.push (visual.on_zoom_change.bind (visual));
}

function set_command_node_callbacks() {
    visual.callbacks_point_play.push(function (point) {
        if (point.type == "control") {
            if (point.control_type == "record") {
                if (point.is_active) {
                    pacs.start_recording (point.control_target);
                    if (point.name_arguments [3]) {
                        pacs.fixed_recording_duration = point.name_arguments [3];
                    }
                }else {
                    pacs.stop_recording ();
                }
            }else if (point.control_type == "play") {
                pacs.add_pac_to_sequence (point.control_target, false);
                console.log (pacs.sequences[point.control_target].sequence.get_print_text ());
            }else if (point.control_type == "loop") {
                if (point.is_active) {
                    pacs.add_pac_to_sequence (point.control_target, true);
                }else {
                    pacs.stop_loops_on_sequence (point.control_target);
                }
            }else if (point.control_type == "pendel") {
                if (point.is_active) {
                    var p = pacs.add_pac_to_sequence (point.control_target, true);
                    if (p) {p.is_pendel = true;}
                }else {
                    pacs.stop_loops_on_sequence (point.control_target);
                }
            }else if (point.control_type == "perm") {
                if (point.name_arguments [2]) {
                    if (pacs.sequences [point.name_arguments [2]]) {
                        pacs.sequences [point.name_arguments [2]].permutate ();
                    }
                }else {
                    pacs.recording_sequence.permutate ();
                }
            }else if (point.control_type == "dev") {
                if (point.name_arguments [2]) {
                    if (pacs.sequences [point.name_arguments [2]]) {
                        pacs.sequences [point.name_arguments [2]].permutate (pacs.sequences [point.name_arguments [2]].last_point);
                    }
                }else {
                    pacs.recording_sequence.permutate (pacs.recording_sequence.last_point);
                }
            }
            else if (point.control_type == "seqr") {
                var neighbours = point.node.get_neighbours ();
                for (var i = 0; i < neighbours.length; i++) {
                    if (neighbours[i].node != point.node.parent) {
                        if (!point.sequences [i]) {point.sequences [i] = new PACSequence (point.name_arguments[2], visual)}
                        var s = point.sequences [i]; 
                        s.create_randomly_from_children_nodes (neighbours[i].id, point.name_arguments[3], point.name_arguments[4]);
                        var p = new PAC (s);
                        pacs.pacs.push (p);
                    }
                }
            }else if (point.control_type == "bang") {
                if (point.is_active) {
                    if (point.pacs.length > 0) {
                        point.start_all_pacs ();
                    }else 
                    {
                        var neighbours = point.node.get_neighbours ();
                        for (var i = 0; i < neighbours.length; i++) {
                            if (!point.sequences [i]) {point.sequences [i] = new PACSequence (point.id+neighbours[i].id, visual)}
                            var time_interval = point.name_arguments[2] ? point.name_arguments[2] : 1000
                            point.sequences [i].push ([point.id, neighbours[i].id], time_interval, true);
                            point.sequences [i].show ();
                            var p = new PAC (point.sequences [i], true);
                            pacs.pacs.push (p);
                            point.pacs.push (p);
                        }
                    }
                    
                }else {
                    point.stop_all_pacs ();
                }
                
            }
            else if (point.control_type == "pause") {
                    if (point.is_active) {
                        if (point.name_arguments [2]) {
                            pacs.stop_on_sequence (point.name_arguments [2]);
                        }else {
                            pacs.stop_all_pacs ();
                        }
                    }else {
                        if (point.name_arguments [2]) {
                            pacs.play_on_sequence (point.name_arguments [2]);
                        }else {
                            pacs.start_all_pacs ();
                        }
                    }
            }else if (point.control_type == "reset") {
                pacs.delete_all_pacs ();
                pacs.init_recording_sequence (point.control_target);
            }
        }
        
    });
    visual.callbacks_point_stop.push(function (point, duration) {
        if (point.name_arguments [1] == "record") {
            pacs.stop_recording ();
        }else if (point.name_arguments [1] == "pause") {
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
    ui_input_container = new InputContainer(PALETTE);
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




