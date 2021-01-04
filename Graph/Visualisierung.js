//PLUGIN FuR GRAPH
const DEFAULT_LINE_COLOUR = "grey";
const UPDATE_RATE = 1000/120;
const FARBEN = ["blue", "red", "yellow", "puple", "green", "orange", "pink", "brown", "white"]
const OPACITY = 1;
const MOUSE_OVER = true;
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

class Line {
    constructor (point_a, point_b, strength, visual) {
        this.point_a = point_a;
        this.point_b = point_b;
        this.point_a.on_position_change = this.callback.bind (this);
        this.point_b.on_position_change = this.callback.bind (this);
        this.strength = strength;
        this.visual = visual;
        this.svg = visual.svg;
        this.html = this.create_html ();
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
        this.update_html_position ();
        console.log ("callback");
    }
    
    create_html () {
        var line = document.createElementNS(SVG_NAMESPACE, 'line');
        line.setAttribute("x1",this.x1+"%");
        line.setAttribute("y1",this.y1+"%");
        line.setAttribute("x2",this.x2+"%");
        line.setAttribute("y2",this.y2+"%");
        line.style.stroke = DEFAULT_LINE_COLOUR;
        line.style.strokeOpacity = OPACITY;
        line.style.strokeWidth = this.strength*2;
        this.svg.appendChild(line);
        return line;
    }

    update_html_position () {
        this.html.setAttribute("x1",this.x1+"%");
        this.html.setAttribute("y1",this.y1+"%");
        this.html.setAttribute("x2",this.x2+"%");
        this.html.setAttribute("y2",this.y2+"%"); 
    }

}

class Point {
    constructor (x, y, node, visual) {
        this._x = x;
        this._y = y;
        this.node = node;
        this.visual = visual;
        this.container=visual.container;
        this.html;
        this.is_playing = false;
        this.mouse_over_aktiv = true;
        this.audio;
        this._url = "";
        this.create_html ();
        this.create_observer ();
        this.update_content ();
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
        this.update_html_position ();
        this.create_event_listeners();
        this.container.appendChild (this.html);
    };

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
        this.visual.create_from_graph (this.visual.graph, this.node);
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
            this.on_position_change ();
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

    on_position_change () {

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
        
        this.scroll_enabled = false;
        this.depth = 4;

        this.x_center = 50; 
        this.y_center = 50; 
        this.radius = 25;
        this.create_html ();
    }

    reset () {
        this.points = [];
        this.lines = [];
        this.svg.innerHTML = "";
        this.container.innerHTML = "";
    }

    create_from_graph (g, start_node) {
        this.reset ();
        this.graph = g;
        if (start_node == null) {
            this.create_points_from_graph (g);
        }else {
            this.create_points_from_start_node (g, start_node);
        }
        this.create_lines_from_graph (g);
    }

    create_html () {
        this.container = document.createElement ("div");
        this.svg = document.createElementNS (SVG_NAMESPACE, "svg");
        this.container.setAttribute ("class", "graphContainer");
        this.svg.setAttribute ("id", "graphSvg");
        this.master_container.appendChild (this.svg);
        this.master_container.appendChild (this.container);
    }

    create_points_from_graph (graph) {
        var level_zero_nodes = graph.get_all_nodes_from_level (0);
        if (level_zero_nodes.length == 1) {
            this.create_points_from_start_node (graph, level_zero_nodes[0], this.x_center, this.y_center, this.radius);
        }else {
            this.create_children_points_from_graph_node (graph,null, this.x_center, this.y_center, this.radius);
        }
    }

    create_points_from_start_node (graph, start_node) {
        this.create_point (this.x_center, this.y_center, start_node);
        this.create_children_points_from_graph_node (graph,start_node, this.x_center, this.y_center, this.radius);
    }

    create_lines_from_graph (graph) {
        graph.edges.forEach(element => {
            this.create_line (element);
        });
    }


    create_children_points_from_graph_node (graph, parentnode, x_center, y_center, radius) {
        var children = graph.get_children_nodes (parentnode);
        for (var i=0; i<children.length; i++) {
            var node = children [i];
            var winkel = i * (2*Math.PI / children.length) + Math.random () * 0.3;
            var { x, y } = this.convert_polar_into_cartesian_coordinates (x_center, y_center, radius, winkel);
            this.create_point (x,y, node)
            this.create_children_points_from_graph_node(graph, node, x, y, radius/2);
        }
    }

    create_point (x,y, node) {
        var p = new Point (x,y, node, this);
        var level = node.level;
        if (!this.points[level]) {
            this.points[level] = [];
        }
        this.points.level.push (p);
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

    convert_polar_into_cartesian_coordinates (x_center, y_center, radius, winkel) {
        var x = x_center + radius * Math.cos(winkel);
        var y = y_center + radius * Math.sin(winkel);
        return { x, y };
    }

    find_point (id) {
        for (var i = 0; i<this.points.length; i++) {
            if (this.points[i].node.id == id) {
                return this.points[i];
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




