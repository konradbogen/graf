//PLUG-IN FuR GRAPH.JS, DATEN.JS, PAC.JS
const SEQ_REGEX = />seq\s(\w*)\s.*/;
const PAC_REGEX = />pac (.*)/;
const NODE_REGEX = /^(?:(\w+))\.*((?:\.*\w+)*(?:\w+)*)$/;
const EDGE_REGEX = /^((?:\w*\.*)(?:\w+\.*\w+)*)-((?:\w*\.*)(?:\w+\.*\w+)*)$/;
const DURATION_REGEXP = /^(\d*)$/


class Lexer {
    constructor () {
        this.node_ids = [];
        this.edge_ids = [];
        this.pac_ids = [];
        this.seq_ids = [];
    }

    create_ids (eingabe) {
        this.create_node_ids (eingabe);
        this.create_edge_ids (eingabe);
        this.create_pac_ids (eingabe);
        this.create_seq_ids (eingabe);
    }

    create_text () {
        var text = "";
        if (this.node_ids) {
            this.node_ids.forEach(element => {
                text = text + element + "\n";
            });
        }
        if (this.edgesIds) {
            this.edgesIds.forEach (element => {
                text = text + element + "\n";
            });
        }
        return text;
    }

    create_pac_ids (eingabe) {
        this.pac_ids = this.extract_id (eingabe, PAC_REGEX);
    }

    create_seq_ids (eingabe) {
        this.seq_ids = this.extract_id (eingabe, SEQ_REGEX);
    }

    create_node_ids (eingabe) {
        this.node_ids = this.extract_id (eingabe, NODE_REGEX);
        return this.node_ids;
    }


    create_edge_ids (eingabe) {
        this.edge_ids = this.extract_id (eingabe, EDGE_REGEX);
        return this.edge_ids;
    }

    extract_id (eingabe, regEx) {
        var lines = this.split_by_lines (eingabe);
        var id_list = [];
        for (let element of lines) {
            if (regEx.test (element)) {id_list.push (element)};
        }
        return id_list;
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
                var pac = new Pac (seq, seq.color);
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
            for (var i = 0; i<FARBEN.length;i++) {
                if (name.includes (FARBEN [i])) {
                    seq.color = FARBEN [i];
                }
            }
            pac_system.sequences.push (seq);
        }
    }


    read_text (text) {
        this.lexer.create_ids (text);
    }

    create_graph (graph) {
        this.create_all_nodes (this.lexer.node_ids, graph);
        this.create_all_edges (this.lexer.edge_ids, graph);
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

    add_all_children_nodes (id, graph, parent) {
        var idTeile = this.split_node_id (id);
        var knotenName = idTeile [0];
        var knoten = this.create_node (parent, knotenName);
        this.add_node_to_graph (graph, knoten, parent);
        if (idTeile[1] != "") {
            this.add_all_children_nodes (idTeile[1], graph, knoten);
        }
    }

    create_node (parent_node, name) {
        var node_id = this.create_node_id (parent_node, name);
        var level = Graph.get_node_level_from_id (node_id);
        var knoten = new Node (node_id, name, parent_node, level);
        return knoten;
    }

    split_seq_id (id) {
        var id_without_predecessor = id.substring (5);
        var id_parts = id_without_predecessor.split (" ")
        return id_parts;
    }

    create_sequence_from_id_parts (name, id_parts, pac_system) {
        var sequence = new Sequence (name);
        sequence.visual = pac_system.visual;
        var total_duration = 0;
        for (var i = 1; i < id_parts.length - 1; i += 2) {
            var duration = this.get_sequence_duration (id_parts[i+1]);
            var duration = id_parts[i+1]*1000
            var egde_id = id_parts[i]
            var node_ids = this.get_node_ids_from_edge_id(egde_id);
            if (node_ids && DURATION_REGEXP.test(duration)){
                sequence.push (node_ids, duration);
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
        var existing_node = graph.find_node (node.id);
        if (!existing_node) {
            graph.add_node (node);
            this.create_edges_to_parent (node, parent_node, graph);
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


    create_edges_to_parent (knoten, parent_node, graph) {
        if (parent_node) {
            graph.add_edge (knoten, graph.find_node(parent_node.id));
        }
    }

    create_node_id (parent_node, name) {
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