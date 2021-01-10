//PLUGIN FuR GRAPH
const DEFAULT_LINE_COLOUR = "grey";
const UPDATE_RATE = 1000/120;
const FARBEN = ["blue", "red", "yellow", "puple", "green", "orange", "pink", "brown", "white"]
const OPACITY = 1;
const MOUSE_OVER = true;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

var FONT_SIZE_ZOOM_FACTOR = 1.1; //depends on UI Max Zoom (*1 equals)
var FONT_SIZE_LEVEL_FACTOR = 1;
var FONT_SIZE_LEVEL_EXP_FACTOR = 2.2;
var RADIUS_LEVEL_FACTOR = 3.5;
var RADIUS_VALUE = 35;

class Line {
    constructor (point_a, point_b, strength, visual) {
        this.point_a = point_a;
        this.point_b = point_b;
        this.point_a.callbacks.push (this.callback.bind(this));
        this.point_b.callbacks.push (this.callback.bind(this));
        this.strength = strength;
        this.visual = visual;
        this.svg = visual.svg;
        this.create_html ();
    }

    get x1 () {
        return this.point_a.x;
    }
    get y1 () {
        return this.point_a.y;
    }
    get x2 () {
        return this.point_b.x;
    }
    get y2 () {
        return this.point_b.y;
    }

    callback () {
        this.update_html ();
        console.log ("callback");
    }
    
    create_html () {
        this.html = document.createElementNS(SVG_NAMESPACE, 'line');
        this.html.setAttribute("x1",this.x1+"%");
        this.html.setAttribute("y1",this.y1+"%");
        this.html.setAttribute("x2",this.x2+"%");
        this.html.setAttribute("y2",this.y2+"%");
        this.html.style.stroke = DEFAULT_LINE_COLOUR;
        this.html.style.strokeOpacity = OPACITY;
        this.html.style.strokeWidth = this.strength*2;
        this.svg.appendChild(this.html);
    }

    update_html () {
        this.html.setAttribute("x1",this.x1+"%");
        this.html.setAttribute("y1",this.y1+"%");
        this.html.setAttribute("x2",this.x2+"%");
        this.html.setAttribute("y2",this.y2+"%"); 

        if (this.point_a.visibility && this.point_b.visibility) {
            this.show ();
        }else {
            this.hide ();
        }
    }

    show () {
        this.html.style.visibility = 'visible';
    }

    hide () {
        this.html.style.visibility = 'hidden';

    }

}

class Point {
    constructor (x, y, node, visual, color) {
        this._x = x;
        this._y = y;
        this.node = node;
        this.visual = visual;
        this.container=visual.container;
        this.html;
        this.color = color ? color : "white";
        this.is_playing = false;
        this.mouse_over_aktiv = true;
        this.audio;
        this._visibility = true;
        this._url = "";
        this.create_html ();
        this.create_observer ();
        this.update_content ();
        this.callbacks = [];
    }

    get visibility () {
        return this._visibility;
    }

    set visibility (val) {
        if (val == true) {
            this.show ();
        }else {
            this.hide ();
        }
    } 

    get id () {
        return this.node.id;
    }

    get url () {
        return this._url;
    }

    set url (val) {
        this._url = val;
        this.update_content ();
        this.set_html_text ();
    }

    get is_link () {
        if (this.url != "") {
            return true;
        }else {
            return false;
        }
    }
    
    set x (value) {
        this.change_position (value, this._y);
    }

    set y (value) {
        this.change_position (this._x, value);
    }

    get x () {
        return this._x;
    }
    get y () {
        return this._y;
    }

    get typ () {
        if (this.url.match (WAV_REGEXP) || this.url.match (MP3_REGEXP)) {
            return "audio"
        }else {
            return "node"
        }
    }

    get absolute_position () {
        var pos = $(this.html).offset();
        return pos;
    }

    change_position (newX, newY) {
        this._x = newX; this._y = newY;
        this.update_html_position ();
    }

    update_html_position () {
        this.html.style.top = this._y+"%"; 
        this.html.style.left = this._x+"%";
    }

    create_html () {
        var h = this.node.level + 1;
        this.html = document.createElement("h"+h);
        this.html.setAttribute("id", this.node.id)
        this.set_html_text();
        this.set_html_style ();
        this.update_html_position ();
        this.create_event_listeners();
        this.container.appendChild (this.html);
    };

    set_html_style () {
        var relative_level = this.node.level - this.visual.start_level;
        var size = 150 / (Math.pow (FONT_SIZE_LEVEL_EXP_FACTOR, relative_level)*FONT_SIZE_LEVEL_FACTOR);
        //var border_width = size/20;
        var border_width = 2;
        var margin = 0;
        var padding = 0;
        //var padding = size*1.2;

        this.html.style.color = this.color;
        this.html.style.border = "solid " + border_width + "%";
        this.html.style.background = "transparent";
        this.html.style.padding = padding + "%";
        this.html.style.margin = margin + "%";
        this.html.style.position = "absolute";
        this.html.style.transform = "translate(-50%, -50%)";
        this.html.style.fontSize = size + "%";
        this.html.style.webkitTransform = "translate(-50%, -50%)";
    }

    set_html_text() {
        if (this.is_link) {
            this.html.innerHTML = "<u>" + this.node.name + "</u>";
            this.html.style.cursor = "pointer";
        } else {
            this.html.innerHTML = this.node.name;
        }
    }

    create_event_listeners() {
        this.html.addEventListener('mouseover', this.mouse_over.bind(this));
        this.html.addEventListener('mouseleave', this.mouse_leave.bind(this));
        this.html.addEventListener('click', this.click.bind(this));
    }

    click () {
        /* if (this.is_playing == true) {
            this.stop ();
        }else {
            this.play ();
        }
        this.mouse_over_aktiv = false; */
        
        //this.visual.create_from_graph (this.visual.graph, this.node);
    }

    mouse_leave () {
        this.mouse_over_aktiv = true;
    }    
    
    mouse_over () {
        if (this.mouse_over_aktiv==true && MOUSE_OVER) {
            this.play ();
        }
    }

    update_content () {
        if (this.typ == "audio") {
            this.audio = new Audio (this.url);
            this.audio.addEventListener ("ended", this.stop.bind (this));
        }
    }

    create_observer (callback) {
        var _callback = this.callback.bind (this);
        let observer = new MutationObserver(_callback);
        let observerOptions = {
            childList: false,
            attributes: true,
            characterData: false,
            subtree: false,
            attributeFilter: ['style', 'offsetTop', 'offsetLeft'],
            attributeOldValue: false,
            characterDataOldValue: false
        };
        observer.observe(this.html, observerOptions);
        return observer;
    }
    
    callback (mutations) {
        var style = mutations[0].target.attributes.style.nodeValue;
        var id = mutations[0].target.attributes.id.nodeValue;
        if (style != null && id != null) {
            var left = this.html.style.left.toString ();
            var top = this.html.style.top.toString ();
            this._x = parseFloat (left.substr (0, left.length - 1));
            this._y = parseFloat (top.substr (0, top.length - 1));
            this.callbacks.forEach (c => {
                c ();
            })
        }    
    }

    play () {
        if (this.typ == "audio") {
            console.log (this.name + " is playing");
            this.is_playing = true;
            this.audio.play ();
            this.html.style.color="white";
        }
    }

    stop () {
        if (this.audio) {
            this.is_playing = false;
            this.audio.pause ();
            this.audio.currentTime = 0;
            this.html.style.color ="black";
        }
    }

    show () {
        this.html.style.visibility = "visible";
        this._visibility = true;
    }   

    hide () {
        this.html.style.visibility = "hidden";
        this._visibility = false;
    }

}

class Visual {
    
    constructor (master_container) {
        this.graph;

        this.points = [];
        this.lines = [];
        this.master_container = master_container; 
        this.container;
        this.svg;
        
        this.default_font_size = 20;
        this._depth = 10;
        this.start_node;

        this.x_center = 50; 
        this.y_center = 50; 
        this.radius = RADIUS_VALUE;
        this.create_html ();
    }

    get start_level () {
        if (this.start_node) {
            return this.start_node.level
        }else {
            return 0;
        }
    }

    get font_size () {
        return this.container.style.fontSize;
    }

    set font_size (val) {
        this.container.style.fontSize = val;
    }

    get max_level () {
        return this.points.length;
    }

    get depth () {
        return this._depth;
    }

    set depth (val) {
        this._depth = val;
        this.reset ();
        this.create_from_graph (this.graph);
    }

    reset () {
        this.points = [];
        this.lines = [];
        this.svg.innerHTML = "";
        this.container.innerHTML = "";
    }

    on_zoom_change (zoom) {
        console.log ("On Zoom Change");
        /* var new_depth = 2+Math.round (zoom*this.max_level);
        if (new_depth != this.depth) {
            this.depth = new_depth;
        } */
        this.font_size = this.default_font_size + zoom*FONT_SIZE_ZOOM_FACTOR*100;
    };

    create_from_graph (g, start_node) {
        this.reset ();
        this.graph = g;
        if (start_node == null) {
            this.create_points_from_graph (g, this.depth);
        }else {
            this.create_points_from_start_node (g, start_node, this.depth);
        }
        this.create_lines_from_graph (g);
    }

    create_html () {
        this.container = document.createElement ("div");
        this.container.className = "graphNodes"; 
        this.svg = document.createElementNS (SVG_NAMESPACE, "svg");
        this.master_container.appendChild (this.svg);
        this.master_container.appendChild (this.container);
        this.font_size = this.default_font_size;
    }


    create_points_from_graph (graph, depth) {
        var level_zero_nodes = graph.get_all_nodes_from_level (0);
        if (level_zero_nodes.length == 1) {
            this.create_points_from_start_node (graph, level_zero_nodes[0], this.x_center, this.y_center, this.radius, depth);
        }else {
            this.create_children_points_from_graph_node (graph,null, this.x_center, this.y_center, this.radius, depth);
        }
    }

    create_points_from_start_node (graph, start_node, depth) {
        this.start_node = start_node;
        this.create_point (this.x_center, this.y_center, start_node);
        this.create_children_points_from_graph_node (graph,start_node, this.x_center, this.y_center, this.radius, depth-1);
    }

    create_lines_from_graph (graph) {
        graph.edges.forEach(element => {
            this.create_line (element);
        });
    }


    create_children_points_from_graph_node (graph, parentnode, x_center, y_center, radius, remaining_depth) {
        var children = graph.get_children_nodes (parentnode);
        for (var i=0; i<children.length; i++) {
            var node = children [i];
            var winkel = i * (2*Math.PI / children.length) + Math.random () * 0.3;
            var { x, y } = this.convert_polar_into_cartesian_coordinates (x_center, y_center, radius, winkel);
            var color = parentnode ? parentnode.color : this.get_random_color ();
            this.create_point (x,y, node, "white")
            if (remaining_depth > 0) {
                this.create_children_points_from_graph_node(graph, node, x, y, radius/RADIUS_LEVEL_FACTOR, remaining_depth-1);
            }
        }
    }

    create_point (x,y, node, color) {
        var p = new Point (x,y, node, this, color);
        var level = node.level;
        if (!this.points[level]) {
            this.points[level] = [];
        }
        this.points[level].push (p);
    }

    create_line (edge) {
        var _points = this.find_points_from_graph_edge (edge);
        if (_points != null) {
            var line = new Line (_points [0], _points [1], 1, this);
            line.edge = edge;
            this.lines.push (line);
        }
    }

    find_points_from_graph_edge (edge) {
        var id1 = edge.node_a.id;
        var id2 = edge.node_b.id;
        var point_a = this.find_point (id1);
        var point_b = this.find_point (id2);
        if (point_a != null && point_b != null) {
            return [point_a, point_b] 
        }else {
            return null;
        }
    }

    change_visibility_of_level (level, visibility) {
        if (this.points[level]){
            this.points[level].forEach (point => {
                point.visibility = visibility;
            });
        }
    }

    convert_polar_into_cartesian_coordinates (x_center, y_center, radius, winkel) {
        var x = x_center + radius * Math.cos(winkel);
        var y = y_center + radius * Math.sin(winkel);
        return { x, y };
    }

    find_point (id) {
            var level = Graph.get_node_level_from_id (id);
            if (this.points[level]) {
                for (var i = 0; i<this.points[level].length; i++) {
                    if (this.points[level][i].node.id == id) {
                        return this.points[level][i];
                    }
                }
            }
    }


    find_line (point_a_id, point_b_id) {
        for (var i = 0; i<this.lines.length; i++) {
            if (this.lines[i].point_a.id == point_a_id && this.lines[i].point_b.id == point_b_id) {
                return this.lines[i];
            }
        }
    }

    get_random_color () {
        var i = Math.round (Math.random () * FARBEN.length);
        return FARBEN [i];
    }

    add_urls_to_points (urls, ids) {
        for (var i = 0; i<ids.length; i++) {
            var point = this.find_point (ids [i]);
            if (point) {
                point.url = urls [i];
            }
        };
    }

    connect_with_file_system (file_system) {
        this.add_urls_to_points (file_system.urls, file_system.node_ids);
    }


}


//339




