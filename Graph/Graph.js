class Graph {
    constructor () {
        this.nodes = [];
        this.edges = [];
    }

    add_node (new_node) {
        var level = new_node.level;
        if (this.nodes[level] == null) {
            this.nodes[level] = [];
        }
        this.nodes[level].push (new_node);
    }

    add_edge (node_a, node_b) {
        var existing_edge = this.find_edge (node_a.id, node_b.id);
        if (existing_edge == null) {
            var new_edge = new Edge (node_a, node_b, 1);
            node_a.grad += 1; node_a.edges.push (new_edge);
            node_b.grad += 1; node_b.edges.push (new_edge);
            this.edges.push (new_edge);
            this.edges.push (new_edge.invert());
            return new_edge;
        }else {
           existing_edge.strength += 1;
           return existing_edge;
        } 
    }

    get_node_names (parent_id) {
        var nodes_names = [];
        var parent_node = this.find_node (parent_id);
        this.get_children (parent_node).forEach (n => {
            nodes_names.push (n.name);
        })
        return nodes_names_graph;
    }

    find_node (id) {
        var level = Graph.get_node_level_from_id (id);
        if (this.nodes[level] != null) {
            for (var i = 0; i<this.nodes[level].length; i++) {
                var node = this.nodes[level][i]
                if (node.id == id) {
                    return node
                }
            }
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
        if (this.nodes[level]) {
            return this.nodes[level];
        } else {
            return [];
        }
    }


    static get_node_level_from_id (id) {
        if (id) {
                var idBestandteile = id.split (".")
            if (idBestandteile != null) {
                return idBestandteile.length-1;
            }else {
                return 0;
            }
        }else {
            return null;
        }
    }

    get_children_nodes (parent_knoten) {
        if (parent_knoten){
            return parent_knoten.children;
        }else {
            return this.get_all_nodes_from_level (0);
        }
    }

    get_children_nodes_from_id (parent_node_id) {
        var parent_level = Graph.get_node_level_from_id (parent_node_id);
        var nodes = [];
        if (this.nodes[parent_level+1]) {
            this.nodes[parent_level+1].forEach (node => {
                if (node.id == parent_node_id) {
                    nodes.push (node);
                }
            })
        }
        return nodes;
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

class Sequence {
    constructor () {
        this.edges = [];
        this.nodes = [];
    }

    get lastNode () {
        if (this.nodes [this.nodes.length-1]) {
            return this.nodes [this.nodes.length-1];
        }else {
            return null;
        }
    }

    push (node) {
        if (this.lastNode) {
            var edge = new Edge (this.lastNode, node)
            this.edges.push (edge);
        }
        this.nodes.push (node);
    }

    push_edge (edge) {
        if (this.edges.length == 0) {
            this.nodes.push (edge.node_a);
        }
        this.nodes.push (edge.node_b)
        this.edges.push (edge);
    }

    permutate () {
        //gap: per index heraussuchen
        var newSequence = new Sequence ();
        var predecessor_node = this.nodes [0];
        this.nodes.forEach (node => {
            var newNode;
            if (node.level == predecessor_node.level)
                newNode = choose (node.parent.children);
            else if (node.level > predecessor_node.level) {
                if (node.parent == predecessor_node) {
                    newNode = choose (node.parent.children);
                }else {
                    var parent = choose (node.parent.parent.children, true);
                    while (parent.children.length == 0) {    
                        parent = choose (node.parent.parent.children, true)
                    }
                    newNode = choose (parent.children) 
                }
            }else if (node.level < predecessor_node.level) {
                if (node = predecessor_node.parent) {
                    newNode = node;
                }else {
                    newNode = choose (node.parent.children)
                }
            }
            newSequence.push (newNode);
            predecessor_node = newNode;
        });
        return newSequence;
    }
}

class Node {
    constructor (id, name, parent, level) {
        this.name = name;
        this.id = id;
        this.parent = parent;
        this.children = [];
        this.level = level;

        this.grad = 0;
        this.edges = [];
    }

    get_neighbours () {
        var neighbours = [];
        this.edges.forEach (e => {
            if (e.node_a.id != this.id) {
                neighbours.push (e.node_a);
            }else {
                neighbours.push (e.node_b)
            }
        })
        return neighbours;
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

function choose (array) {
    var i = Math.round (Math.random () * (array.length-1));
    return array [i];
}