const TEST_MODE = true;
const RUNNING_IN_LOCAL = false;

/* const PALETTE = [
    '#004F2D',
    '#247BA0',
    '#e6af2e',
    '#F76F8E',
    '#550C18',
    '#3B429F']; //in # and ' for anime.js compatibility;  */

const PALETTE = [
        '#a3a19b',
        '#ded9ca',
        '#b5a984',
        '#544c33',
]
 //in # and ' for anime.js compatibility;  */

var stored_entry_path = "./Stored/";

class HPTGN  {
    constructor (div_id, options) {
        this.graph;
        this.parser;
        this.visual;
        this.files;

        this.ui_menu; 
        this.ui_header;
        this.ui_zoom_container;
        
        this.on_ready_callbacks = [];
        this.is_ready = false;
        this._storing_name;
        this._is_stored = false;

        $(document).ready(function (){
            this.create_visual (div_id, options.clickToOpenEnabled, options.mouseOverEnabled, options.lightTheme, options.frameEnabled);
            if (options.hasUi) {this.create_ui (div_id, options.hasUiHeader, options.hasUiMenu, options.zoomEnabled)};
            if (options.hasFileSystem) {this.create_filesystem (this.visual, options.fileSystemDirectory)};
            this.load_default_entry ();
            this.is_ready = true;
            this.on_ready_callbacks.forEach (c => {c ()})
            this.on_ready ();
        }.bind (this));

        window.onpopstate = function (e) {
            var stored_entry = sessionStorage.getItem('graph_entry');
            this.update_input (stored_entry); 
        }.bind (this);
    }
    
    set storing_name (val) {
        if (this.is_ready) {
            this._storing_name = val;
            if (this.ui_header) {
                this.ui_header.value = val
            };
            if (this.storing_name.includes ("/")) {
                var filename = this.storing_name.replaceAll ("/", "");
                this.load_files(filename, this.files.get_all_ids_entry_text());
            } 
            else {
                this.load_files(val);
            } 
        }else {
            this.on_ready_callbacks.push (function () {
                this.storing_name = val;
            }.bind (this))
        }
        
    }

    get storing_name () {
        return this._storing_name;
    }

    set is_stored (val) {
        this._is_stored = val;
        if (this.ui_header) {
            if (val == true) {
                this.ui_header.shines = true;
            }else {
                this.ui_header.shines = false;
            }
        }
    }

    get is_stored () {
        return this.is_stored;
    }

    on_ready () {

    }

    create_visual (div_id, clickToOpenEnabled, mouseOverEnabled, lightTheme, frameEnabled) {
        var graphContainer = this.create_graph_container(div_id);
        this.visual = new Visual (graphContainer);
        this.visual.clickToOpen = clickToOpenEnabled;
        this.visual.frameEnabled = frameEnabled;
        this.visual.lightmode = lightTheme;
        this.visual.mouseOverEnabled = mouseOverEnabled;
        this.set_visual_callbacks();
    }
    
    create_filesystem (visual, directory) {
        this.files = new FileSystem(directory);
        if (RUNNING_IN_LOCAL == false) {
            this.files.read_directory();
        }
        visual.connect_with_file_system(this.files);
    }

    create_graph_container (div_id) {
        var graphContainer = document.createElement("div");
        graphContainer.id = "graphContainer";
        document.getElementById(div_id).appendChild(graphContainer);
        return graphContainer;
    }

    create_ui(div_id, createUiHeader, createUiMenu, createZoomContainer) {
        if (createUiMenu) {
            this.ui_menu = new Menu (div_id, PALETTE);
            this.create_ui_menu_callback();
        }
        if (createZoomContainer) {
            this.ui_zoom_container = new ZoomContainer();
        }
        if (createUiHeader) {
            this.ui_header = new HeaderInput (div_id);
            this.create_ui_header_callbacks();
        }
    }

    create_ui_menu_callback() {
        this.ui_menu.onSubmitClick = function (val) {
            this.update_input(val, false);
        }.bind(this);
        this.create_ui_mute_callbacks();
    }

    create_ui_mute_callbacks() {
        this.ui_menu.onMuteChange = function (val) {
            if (val) {
                this.visual.mute();
            } else {
                this.visual.init_audio();
                this.visual.unmute();
            }
        }.bind(this);
    }

    create_ui_header_callbacks() {
        this.ui_header.onEnter = function (e) {
            this.store_file(this.ui_header.value);
        }.bind(this);
        this.ui_header.onInput = function (e) {
            this.is_stored = false;
            this.storing_name = this.ui_header.value;
        }.bind(this);
    }

    create_pacsystem() {
        if (this.visual) {
            this.pacs = new PACSystem(this.visual);
            this.parser.create_all_sequences(this.pacs);
            this.parser.create_all_pacs(this.pacs);
            this.pacs.show_all_sequences();
        }else {
            this.on_ready_callbacks.push (this.create_pacsystem.bind (this));
        }
    }
    
    update_visual() {
        if (this.visual) {
            var url_passed_start_node = this.get_url_parameter("sub");
            if (!url_passed_start_node) {
                url_passed_start_node = this.get_url_parameter("s");
            }
            this.visual.start_node = this.graph.find_node(url_passed_start_node);
            this.parser.set_visual_parameters (this.visual);
            this.visual.create_from_graph(this.graph, this.visual.start_node);
        }else {
            this.on_ready_callbacks.push (this.update_visual.bind (this));
        }

    }

    update_input (input) {
        if (this.ui_menu) {
            this.ui_menu.text = input;
        }
        this.parser = new Parser ();
        this.parser.read_text (input);
        sessionStorage.setItem('graph_entry', input);
        this.create_graph();
        this.is_stored = false;
    }

    store_file(name) {
        if (this.files) {
            var filename = name.replaceAll ("/", "");
            this.files.save_storagefile_text(filename, this.parser.lexer.create_text ());
            this.is_stored = true;
        }
    }

    load_files(name, additional_text) {
        if (this.files) {
            if (name != "") {
                this.parts = name.split ("+");
                this.full_text =  additional_text ? additional_text + "/n" : "";
                this.i = 0;
                this.parts.forEach (p=> {
                    this.files.get_storagefile_text (p, function (filetext = "") {
                        this.full_text = this.full_text + filetext;
                        if (this.i == this.parts.length - 1) {
                            this.is_stored = true;
                            this.update_input (this.full_text);
                        }
                        this.i ++;
                    }.bind(this));
                })
            }else {
                this.update_input (additional_text);
            }
        }else { 
            this.on_ready_callbacks.push (function () {
                this.load_files (name, additional_text);
            }.bind (this))
        }   
    }

    create_graph () {
        this.graph = new Graph ();
        this.parser.create_graph (this.graph);
        this.update_visual();
        destroyAllStreamPeers ();
        this.create_pacsystem();
    }
    
    load_default_entry () {
        var stored_entry = sessionStorage.getItem('graph_entry');
        var param = this.get_url_parameter ("b");
        if (param) {
            this.storing_name = param;
        }else {
            if (stored_entry) {
                this.update_input (stored_entry);
            }else {
                this.storing_name = "Blank";
            }
        }
    }

    set_visual_callbacks () {
        this.visual.callback_create_from_graph = function () {
            if (this.ui_zoom_container) {
                this.ui_zoom_container.reset_zoom();
            }
            this.update_document_title ();
            this.update_url ();
        }.bind (this);
        if (this.ui_zoom_container) {t
            his.ui_zoom_container.callbacks.push (this.visual.on_zoom_change.bind (this.visual))
        };
        this.set_command_node_callbacks();
    }
    
    update_url () {
        var start_node_tag = "";
        var storing_name_tag = "";
        if (this.storing_name) {
            storing_name_tag = "?b=" + this.storing_name;
        }
        if (this.visual.start_node) {
            start_node_tag =  "?s=" + this.visual.start_node.id;
        }
        window.history.pushState(null, null, start_node_tag+storing_name_tag);
    }

    set_command_node_callbacks() {
        this.visual.callbacks_point_play.push( function (point) {
            if (point.type == "control") {
                if (point.control_type == "record") {
                    this.handle_record_point(point);
                }else if (point.control_type == "play") {
                    this.handle_play_point (point);
                }else if (point.control_type == "loop") {
                    this.handle_loop_point(point);
                }else if (point.control_type == "pendel") {
                    this.handel_pendel_point(point);
                }else if (point.control_type == "perm") {
                    this.handle_perm_point(point);
                }else if (point.control_type == "dev") {
                    this.handle_dev_point(point);
                }else if (point.control_type == "seqr") {
                    this.handle_seqr_point(point);
                }else if (point.control_type == "bang") {
                    this.handle_bang_point (point);
                }else if (point.control_type == "pause") {
                    this.handle_pause_point(point);
                }else if (point.control_type == "reset") {
                    this.handle_reset_point(point);
                }
            }         
        }.bind (this));
    }
     
    handle_reset_point(point) {
        this.pacs.delete_all_pacs();
        this.pacs.init_recording_sequence(point.control_target);
    }

    handle_pause_point(point) {
        if (point.is_active) {
            if (point.name_arguments[2]) {
                this.pacs.stop_on_sequence(point.name_arguments[2]);
            } else {
                this.pacs.stop_all_pacs();
            }
        } else {
            if (point.name_arguments[2]) {
                this.pacs.play_on_sequence(point.name_arguments[2]);
            } else {
                this.pacs.start_all_pacs();
            }
        }
    }

    handle_seqr_point(point) {
        var neighbours = point.node.get_neighbours();
        for (var i = 0; i < neighbours.length; i++) {
            if (neighbours[i].node != point.node.parent) {
                if (!point.sequences[i]) { point.sequences[i] = new PACSequence(point.name_arguments[2], visual); }
                var s = point.sequences[i];
                s.create_randomly_from_children_nodes(neighbours[i].id, point.name_arguments[3], point.name_arguments[4]);
                var p = new PAC(s);
                this.pacs.pacs.push(p);
            }
        }
    }

    handle_dev_point(point) {
        if (point.name_arguments[2]) {
            if (this.pacs.sequences[point.name_arguments[2]]) {
                this.pacs.sequences[point.name_arguments[2]].permutate(pacs.sequences[point.name_arguments[2]].last_point);
            }
        } else {
            this.pacs.recording_sequence.permutate(pacs.recording_sequence.last_point);
        }
    }

    handle_perm_point(point) {
        if (point.name_arguments[2]) {
            if (this.pacs.sequences[point.name_arguments[2]]) {
                this.pacs.sequences[point.name_arguments[2]].permutate();
            }
        } else {
            this.pacs.recording_sequence.permutate();
        }
    }

    handel_pendel_point(point) {
        if (point.is_active) {
            var p = this.pacs.add_pac_to_sequence(point.control_target, true);
            if (p) { p.is_pendel = true; }
        } else {
            this.pacs.stop_loops_on_sequence(point.control_target);
        }
    }

    handle_loop_point(point) {
        if (point.is_active) {
            this.pacs.add_pac_to_sequence(point.control_target, true);
        } else {
            this.pacs.stop_loops_on_sequence(point.control_target);
        }
    }

    handle_play_point(point) {
        this.pacs.add_pac_to_sequence(point.control_target, false);
        console.log(pacs.sequences[point.control_target].sequence.get_print_text());
    }

    handle_record_point(point) {
        if (point.is_active) {
            this.pacs.start_recording(point.control_target);
            if (point.name_arguments[3]) {
                this.pacs.fixed_recording_duration = point.name_arguments[3];
            }
        } else {
            this.pacs.stop_recording();
        }
    }

    handle_bang_point (point) {
        if (point.is_active) {
            if (point.pacs.length > 0) {
                this.point.start_all_pacs ();
            }else 
            {
                var neighbours = point.node.get_neighbours ();
                for (var i = 0; i < neighbours.length; i++) {
                    if (!point.sequences [i]) {point.sequences [i] = new PACSequence (point.id+neighbours[i].id, this.visual)}
                    var time_interval = point.name_arguments[2] ? point.name_arguments[2] : 1000
                    point.sequences [i].push ([point.id, neighbours[i].id], time_interval, true);
                    point.sequences [i].show ();
                    var p = new PAC (point.sequences [i], true);
                    this.pacs.pacs.push (p);
                    point.pacs.push (p);
                }
            }
            
        }else {
            point.stop_all_pacs ();
        }
    }

    update_document_title () {
        if (this.visual.start_node) {
            document.title = "heptagon." + this.visual.start_node.id;
        }else {
            document.title = "heptagon";
        }
    }
     
    get_url_parameter (name, w){
        w = w || window;
        var rx = new RegExp('[\?]' + name + '=([^\?]*)'),
            val = w.location.search.match(rx);
        if (val) {
            var result = val [1];
            if (result.includes ("?")) {
                return result.split ("?") [1];
            }else {
                return result;
            }
        }else {
            return null;
        }
    }
}



