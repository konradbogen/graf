class Graph {
    constructor () {
        this.nodes = [];
        this.edges = [];
    }

    add_node (neuerKnoten) {
        this.nodes.push (neuerKnoten);
    }

    add_edge (node_a, node_b) {
        var existing_edge = this.find_edge (node_a.id, node_b.id);
        if (existing_edge == null) {
            var neueVerbindung = new Edge (node_a, node_b, 1);
            node_a.grad += 1; node_a.edges.push (neueVerbindung);
            node_b.grad += 1; node_b.edges.push (neueVerbindung);
            this.edges.push (neueVerbindung);
            this.edges.push (neueVerbindung.invert());
        }else {
           existing_edge.strength += 1;
        }
    }

    find_node (id) {
        for (let element of this.nodes){
            if (element.id==id) {
                return element;
            };
        }
        return null;
    }   

    find_edge (node_a_id, node_b_id) {
        for (let element of this.edges){
            if ((element.node_a.id == node_a_id && element.node_b.id == node_b_id)) {
                return element;
            }
        }
        return null;
    }

    get_all_nodes_from_level (level) {
        var knoten = [];
        for (let element of this.nodes){
            if (element.level==level) {
                knoten.push (element);
            };
        }
        return knoten;
    }

    get_children_nodes (parent_knoten) {
        if (parent_knoten){
            var children = [];
            this.nodes.forEach(element => {
                if (element.parent) {
                    if (element.parent.id == parent_knoten.id) {
                        children.push (element);
                    }
                }
            });
            return children;
        }else {
            return this.get_all_nodes_from_level (0);
        }
    }

    get_all_paths_from_a_to_b (start_node, final_node) {
        var finished_paths = [];
        var all_start_paths = [];
        start_node.edges.forEach (verbindung => {
            var start_path = [];
            start_path.push (verbindung.align_from_start_node (start_node));
            all_start_paths.push (start_path);
        })
        this.extend_paths_to_final_node (all_start_paths, finished_paths, final_node);
        return finished_paths;
    }

    extend_paths_to_final_node (offene_pfade, finished_paths, final_node) {
        var console_text = "";
        offene_pfade.forEach (pfad => {
                if (pfad [pfad.length-1].contains_node (final_node)) {
                        finished_paths.push (pfad);
                        console.log (this.get_path_text(pfad))
                } else {
                    var erweiterte_pfade = this.extend_path (pfad);
                    this.extend_paths_to_final_node (erweiterte_pfade,finished_paths,final_node);
                }
        })
        return finished_paths;
    }

    extend_path (pfad) {
        var anknupf_knoten = pfad[pfad.length-1].node_b;
        var alle_neuen_verbindungen = anknupf_knoten.verbindungen;
        var erweiterte_pfade = [];

        alle_neuen_verbindungen.forEach (neue_verbindung => {
            var neuer_pfad = [];
            var neuer_pfad_ist_loop = false;
            neue_verbindung = neue_verbindung.align_from_start_node (anknupf_knoten);
            pfad.forEach (verbindung => {
                if (verbindung.contains_node (neue_verbindung.node_b)) {
                    neuer_pfad_ist_loop = true;
                }else {
                    neuer_pfad.push (verbindung);
                }
            });
            if (neuer_pfad_ist_loop == false) {
                neuer_pfad.push (neue_verbindung);
                erweiterte_pfade.push (neuer_pfad);
            }
        })
        return erweiterte_pfade;
    }

    get_path_text (pfad) {
        var text = pfad[0].node_a.name;
        for (var i = 0; i<pfad.length; i++) {
            text = text + "-" + pfad[i].node_b.name;
        }
        return text;
    }

}   

class Node {
    constructor (id, name, parent, level) {
        this.name = name;
        this.id = id;
        this.parent = parent;
        this.level = level;

        this.grad = 0;
        this.edges = [];
    }
}

class Edge {
    constructor (node_a, node_b, strength) {
        this.node_a = node_a;
        this.node_b = node_b;
        this.strength = 1;
    }

    contains_node (knoten) {
        if (this.node_a.id == knoten.id || this.node_b.id == knoten.id) {
            return true; 
        }else {
            return false;
        }
    }

    invert () {
        return new Edge (this.node_b, this.node_a, this.strength)
    }

    align_from_start_node (start_node) {
        if (this.node_a==start_node) {
            return this;
        }else if (this.node_b==start_node) {
            return this.invert();
        }
    }

}

//171