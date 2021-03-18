//PLUG-IN FuR GRAPH.JS, DATEN.JS, PAC.JS
const SEQ_REGEX = />seq\s(\w*)\s.*/;
const PAC_REGEX = />pac (.*)/;
const SUB_REGEX = />sub (.*)/;
const NODE_REGEX = /^(?:(\w+))\.*((?:\.*\w+)*(?:\w+)*)$/;
const EDGE_REGEX = /^((?:\w*\.*)(?:\w+\.*\w+)*)-((?:\w*\.*)(?:\w+\.*\w+)*)$/;
const DURATION_REGEXP = /^(\d*)$/
const LIGHTMODE_REGEXP = />brightlight/;
const DARKMODE_REGEXP = />darkuniverse/;


class Lexer {
    constructor () {
        this.init_ids ();
    }

    test_id (line, reg_ex) {
        if (line.includes (",")) {
            console.log ("dont use , in filenames!")
            return false;
        }else {
            if (line.match (reg_ex)) {
                return true
            }
        }
        return false;
    }

    init_ids () {
        this.node_ids = [];
        this.edge_ids = [];
        this.pac_ids = [];
        this.seq_ids = [];
        this.sub_ids = [];
        this.visual_flag = "dark";
    }

    categorize_ids (eingabe) {
        this.init_ids ();
        var lines = this.split_by_lines (eingabe);
        for (let line of lines) {
            if (this.test_id (line, NODE_REGEX)) {
                this.node_ids.push (line);
            }else if (this.test_id (line, EDGE_REGEX)) {
                this.edge_ids.push (line);
            }
            else if (this.test_id (line, SEQ_REGEX)) {
                this.seq_ids.push (line)
            }else if (this.test_id (line, PAC_REGEX)) {
                this.pac_ids.push (line);
            }else if (this.test_id (line, SUB_REGEX)) {
                this.sub_ids.push (line);
            }else if (this.test_id (line, LIGHTMODE_REGEXP)) {
                this.visual_flag = "light";
            }else if (this.test_id (line, DARKMODE_REGEXP)) {
                this.visual_flag = "dark";
            }
        }
      
    }

    create_text () {
        var text = "";
        if (this.node_ids) {
            this.node_ids.forEach(element => {
                text = text + element + "\n";
            });
        }
        if (this.edge_ids) {
            this.edge_ids.forEach (element => {
                text = text + element + "\n";
            });
        }
        if (this.pac_ids) {
            this.pac_ids.forEach (element => {
                text = text + element + "\n";
            });
        }
        if (this.seq_ids) {
            this.seq_ids.forEach (element => {
                text = text + element + "\n";
            });
        }
        return text;
    }

    split_by_lines (eingabe) {
        var lines = eingabe.split ("\n");
        return lines;
    }

}

class Parser {
    constructor () {
        this.lexer = new Lexer ();
        this.relative_seq_duration = true;
        this.start_node_id;
    }

    set_visual_parameters (visual) {
        if (this.lexer.visual_flag == "light") {
            visual.lightmode = true;
        }else {
            visual.lightmode = false;
        }
    }

    create_all_pacs (pac_system) {
        for (let id of this.lexer.pac_ids) {
            this.create_pac (id, pac_system);
        }
    }

    create_pac (id, pac_system) {
        var name = id.substring (5);
        pac_system.sequences.forEach(seq => {
            if (seq.name == name) {
                var pac = new PAC (seq, seq.color);
                pac_system.pacs.push (pac);
            }
        });
    }

    create_all_sequences (pac_system) {
        for (let id of this.lexer.seq_ids) {
            this.add_sequence (id, pac_system);
        }
    }

    add_sequence (id, pac_system) {
        var id_parts = this.split_seq_id (id);
        var name = id_parts [0];
        if (name) {
            var seq = this.create_sequence_from_id_parts (name, id_parts, pac_system);
            pac_system.sequences[seq.name] = seq;
        }
    }

    create_graph_from_text (graph, text) {
        this.read_text (text);
        this.create_graph (graph);
    }

    read_text (text) {
        this.lexer.categorize_ids (text);
    }

    create_graph (graph) {
        this.set_start_node_id_from_lexer ();
        if (this.start_node_id) {
            //this.create_all_nodes_from_parent (this.lexer.node_ids, this.parent_node_id, graph);
            this.create_all_nodes (this.lexer.node_ids, graph);
        }else {
            this.create_all_nodes (this.lexer.node_ids, graph);
        }
        this.create_all_edges (this.lexer.edge_ids, graph);
    }

    set_start_node_id_from_lexer () {
        if (this.lexer.sub_ids[0]) {
            var id = this.lexer.sub_ids[0].substring (5);
            this.start_node_id = id;
        }
    }

    create_all_edges (edge_ids, graph) {
        for (let id of edge_ids) {
            this.create_edge (id, graph);
        }
    }

    create_all_nodes (node_ids, graph) {
        for (var i = 0; i<node_ids.length; i++) {
            var id = node_ids [i];
            this.add_all_children_nodes (id, graph, null);
        }
    }

    create_all_nodes_from_parent (node_ids, parent_id, graph) {
        for (var i = 0; i<node_ids.length; i++) {
            var id = node_ids [i];
            if (id.startsWith (parent_id)) {
                this.add_all_children_nodes (id, graph, null);
            }
        }
    }

    add_all_children_nodes (node_id, graph, parent_node) {
        var id_parts = this.split_node_id (node_id);
        var id = this.prepend_parent_id (parent_node, id_parts [0]);
        var node = graph.find_node (id);
        if (node == null) {
            node = this.create_node (id, id_parts [0], parent_node);
            this.add_node_to_graph (graph, node, parent_node);
        }
        if (id_parts[1] != "") {
            this.add_all_children_nodes (id_parts[1], graph, node);
        }
    }

    create_node (node_id, node_name, parent_node) {
        var level = Graph.get_node_level_from_id (node_id);
        var node = new Node (node_id, node_name, parent_node, level);
        return node;
    }

    get_node_name_from_node_id (node_id) {
        var id_parts = this.split_node_id (node_id.lastIndexOf ("."));
        return id_parts [1];
    }

    split_seq_id (id) {
        var id_without_predecessor = id.substring (5);
        var id_parts = id_without_predecessor.split (" ")
        return id_parts;
    }

    create_sequence_from_id_parts (name, id_parts, pac_system) {
        var sequence = new PACSequence (name);
        sequence.visual = pac_system.visual;
        var total_duration = 0;
        for (var i = 1; i < id_parts.length - 1; i += 2) {
            var duration = this.get_sequence_duration (id_parts[i+1]);
            var duration = id_parts[i+1]*1000
            var node_id = id_parts[i]; 
            var point = pac_system.visual.find_point (node_id);
            if (node_id && DURATION_REGEXP.test(duration)){
                sequence.add_point (point, duration);
            }
            total_duration += duration;
        }
        return sequence;
    }

    get_sequence_duration (id_part, total_duration) {
        if (this.relative_seq_duration = true) {
            return id_part*1000;
        }else {
            return id_part*1000-total_duration;
        }
    }

    add_node_to_graph (graph, node, parent_node) {
            graph.add_node (node);
            if (parent_node) {
                parent_node.children.push (node);
                graph.add_edge (node, parent_node);
            }
    }

    create_edge (edge_id, graph) {
        var node_ids = this.get_node_ids_from_edge_id (edge_id);
        var nodeA = graph.find_node (node_ids [0]);
        var nodeB = graph.find_node (node_ids[1]);
        if (nodeA && nodeB != null) {
            graph.add_edge (nodeA, nodeB);
        }   
    }

    prepend_parent_id (parent_node, name) {
        var node_id = name;
        if (parent_node) {
            node_id =  parent_node.id + "." + name;
        }
        return node_id;
    }



    split_node_id (id) {
        var idBasis = this.extract_id_base (id);
        var idSchwanz = this.extract_id_tail (id);
        if (idBasis == "") {
            idBasis = id;
        }
        var idTeile = [idBasis, idSchwanz];
        return idTeile;
    }

    get_node_ids_from_edge_id (edgeId) {
        var idBestandteile = edgeId.split ("-");
        var node_ids = [];
        if (idBestandteile != null){
            for (let element of idBestandteile) {
                node_ids.push (element);
            }
        }
        return node_ids;
    }

    extract_id_base (id) {
        var id_parts = id.match (NODE_REGEX);
        if (id_parts != null) {
            return id_parts[1];
        }else {
            return "";
        }
    }

    extract_id_tail (id) {
        var id_parts = id.match (NODE_REGEX);
        if (id_parts != null) {
        return id_parts[2];
        }else {
            return "";
        }
    }

   
}

//277