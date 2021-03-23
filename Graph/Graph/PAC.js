//PLUGIN FÜR VISUAL
const UPDATE_RATE = 1000/120;
const DEFAULT_LINE_COLOUR = "white";
const COLOR_NAMES = ["blue", "red", "yellow", "green", "pink", "orange", "purple"];

function is_color (string) {
    COLOR_NAMES.forEach (n => {
        if (string == n) {
            is_color_name = true;
            return n;
        }
    })
    return null;    
}

class PACSequence {
    constructor (name, visual) {
        this.sequence = new Sequence ();
        this.name = name;
        this.color = this.get_color_from_name();
        this.lines = [];
        this.start_point;
        this.durations = [];
        this.node_playing_times = [];
        this.visual = visual;
    }
    
    get last_point () {
        if (this.lines.length > 0) {
            return this.lines[this.lines.length-1].point_b;
        }else {
            return null;
        }
    }

    get length () {
        return this.lines.length;
    }

    get_color_from_name () {
        var color_name = is_color (this.name);
        var color;
        if (color_name == "blue") {
            color = "#4F6FBA"
        }else if (color_name == "red") {
            color = "#E76F51";
        }else if (color_name == "yellow") {
            color = "#E9C46A"
        }else if (color_name == "green") {
            color = "#629460"
        }else if (color_name == "pink") {
            color = "#F98AB3"
        }else if (color_name == "orange") {
            color = "#F4A261"
        }else if (color_name == "purple") {
            color = "#854773"
        }else {
            color = "#E76F51";
        }
        return color;
    } 

    get_point_at_index (i) {
        if (i == this.lines.length) {
           return this.line[i-1].point_b;
        }else if (i < 0){
            return null;
        }else {
            node = this.line[i].point_a;
        }
    }

    create_from_sequence (sequence, durations) {
        this.sequence = sequence;
        var i = 0; sequence.edges.forEach (e => {
            this.push ([e.node_a.id, e.node_b.id], durations [i], false);
            i++;
        })
    }

    show () {
        this.lines.forEach (line => {
            this.show_line (line);
        })
    }

    show_line (line) {
        line.html.style.stroke = this.color;
        line.html.style.strokeWidth = line.strength*4;
        line.html.style.opacity = 1;
    }

    hide () {
        this.lines.forEach (line => {
            line.html.style.stroke = DEFAULT_LINE_COLOUR;
            line.html.style.strokeWidth = line.dicke*2;
            line.html.style.opacity = line.opacity;
        })
    }

    play (index, take_point_b=false) {
        if (index < this.lines.length) {
            var point = take_point_b ? this.lines[index].point_b : this.lines[index].point_a;
            if (point.control_type != "record" && point.control_type != "bang") {
                point.play ();
            }
        }
    }

    stop (index) {
        if (index < this.lines.length) {
            //this.lines[index].point_a.stop ();
        }
    } 

    push (node_ids, duration=1000, push_edge_to_sequence=true) {
        this.durations.push (duration);
        var line = this.visual.find_line (node_ids [0], node_ids [1])
        if (line == null) {
            var node_a = this.visual.graph.find_node (node_ids [0]);
            var node_b = this.visual.graph.find_node (node_ids [1]);
            var edge = this.visual.graph.add_edge (node_a, node_b);
            line = this.visual.create_line (edge);
        }
        if (push_edge_to_sequence) {this.sequence.push_edge (line.edge);}
        this.lines.push (line);
        this.show_line (line);
    }

    add_point (point, duration) { 
        if (this.lines.length == 0) {
            if (this.start_point) {
                this.push ([this.start_point.node.id, point.node.id], duration);
            }else {
                this.start_point = point;
            }
        }else {
            this.push ([this.last_point.node.id, point.node.id], duration);
        }
    }

    shift () {
        this.lines.shift ();
        this.sequence.edges.shift ();
        this.durations.shift ();
    }

    reverse_lines () {
        var rev_lines = []; 
        for (var i = this.lines.length-1; i >= 0; i--) {
            this.lines [i].reverse ();
            rev_lines.push (this.lines [i]);
        }
        this.lines = rev_lines;
    }

    clear () {
        this.hide ();
        this.lines = [];
        this.durations = [];
        this.sequence = new Sequence ();
    }

    create_randomly_from_children_nodes (parent_node_id, length=3, duration=2000) {
        this.clear ();
        var children_points = this.visual.get_children_points (parent_node_id);
        this.add_point (this.visual.find_point (parent_node_id), duration);
        var available_indexes = [];
        for (var i = 0; i < children_points.length; i++) {
            available_indexes.push (i);
        }
        for (var i = 0; i<length;i++) {
            if (available_indexes.length == 0) {
                break;
            }
            var r = Math.round (Math.random () * (available_indexes.length-1));
            var randomIndex = available_indexes [r]; available_indexes.splice (r, 1)
            this.add_point (children_points [randomIndex], duration)
        }
    }

    permutate (start_point) {
        var newSequence = this.sequence.permutate ();
        var old_durations = this.durations.slice ();
        this.clear (true);
        if (start_point) {
            newSequence.nodes [0] = start_point.node;
            newSequence.edges [0].node_a = start_point.node;
        }
        this.create_from_sequence (newSequence, old_durations);
    }
}

class PACSystem {
    constructor (visual, graph) {
        this.recording_sequence;
        this.visual = visual;
        this.pacs = [];
        this.sequences = [];
        this.date = new Date(); 
        this.last_date = new Date ();
        this.is_recording = false;
        this.init_recording_sequence ();
        this.speed = 1;
        this.fixed_recording_duration = null;
        this.timer = setInterval (this.update_pacs.bind (this), UPDATE_RATE)
        this.visual.callbacks_point_play.push (this.add_recorded_point.bind (this));
    }

    delete_all_pacs () {
        this.pacs.forEach (pac => {
            pac.delete ();
            pac = [];
        });
        this.pacs = [];
    }

    stop_all_pacs () {
        this.pacs.forEach (pac => {
            pac.active = false;
        });
    }

    start_all_pacs () {
        this.pacs.forEach (pac => {
            pac.active = true;
        });
    }

    update_pacs () {
        this.pacs.forEach (pac=>{
            pac.update (UPDATE_RATE*this.speed);
        });
    }

    show_all_sequences () {
        this.sequences.forEach (seq => {
            seq.show ();
        })
    }

    add_recorded_point (point) {
        if (this.is_recording) {
            this.date = new Date ();
            if (this.last_date == null) {this.last_date = this.date};
            if (this.fixed_recording_duration == null) {
                var duration = (this.date - this.last_date);
            }else {
                var duration = this.fixed_recording_duration;
            }
            this.last_date = this.date;
            if (!(this.recording_sequence.length == 0 && point.control_type == "record")) {
                this.recording_sequence.add_point (point, duration);
            }
        }
    }

    init_recording_sequence (_seq_name) {
        var seq_name = _seq_name || "recorded";
        if (this.sequences[seq_name]) {this.sequences[seq_name].hide ();};
        this.sequences[seq_name] = new PACSequence (_seq_name, this.visual); 
        this.sequences[seq_name].visual = this.visual;
        this.recording_sequence = this.sequences[seq_name];
    }

    add_pac_to_sequence (_seq_name, loop) {
        var seq_name = _seq_name || "recorded";
        var pac;
        if (this.sequences[seq_name]) {
            pac = new PAC (this.sequences[seq_name], loop);
            this.pacs.push (pac);
        }
        return pac;
    }

    get_pacs_on_sequence (_seq_name) {
        var matching_pacs = [];
        this.pacs.forEach (p => {
            if (p.playing_sequence.name == _seq_name) {
                matching_pacs.push (p);
            }
        });
        return matching_pacs;
    }

    delete_on_sequence (_seq_name) {
        var pacs = this.get_pacs_on_sequence (_seq_name);
        pacs.forEach (p => {
            p.delete ();
        })
    }

    play_on_sequence (_seq_name) {
        var pacs = this.get_pacs_on_sequence (_seq_name);
        pacs.forEach (p => {
            p.active = true;
        })
    }

    stop_on_sequence (_seq_name) {
        var pacs = this.get_pacs_on_sequence (_seq_name);
        pacs.forEach (p => {
            p.active = false;
        })
    }

    stop_loops_on_sequence (_seq_name) {
        var pacs = this.get_pacs_on_sequence (_seq_name);
        pacs.forEach (p => {
            p.is_looping = false;
        })
    }

    start_recording (_seq_name) {
        this.date = null; this.last_date = null;
        this.fixed_recording_duration = null;
        this.init_recording_sequence (_seq_name);
        this.is_recording = true;
    }

    stop_recording () {
        this.is_recording = false;
        this.recording_sequence.show ();
    }

}

class PAC {
    constructor (sequence, looping = false) {
        this.playing_sequence = this.copy_sequence (sequence);
        this.stored_sequence = sequence;
        this.color = sequence.color;
        this.local_progress = 0;
        this.active = true;
        this.is_looping = looping;
        this.is_pendel = false;
        this.svg_container = sequence.visual.line_svg;
        this.svg_element;
        this.erstelle_svg ();
        this.exec ();
    }

    

    copy_sequence (sequence) {
        var new_sequence = new PACSequence (sequence.name, sequence.visual)
        new_sequence.color = sequence.color;
        sequence.lines.forEach(line => {
            new_sequence.lines.push (line);
        })
        sequence.durations.forEach (duration => {
            new_sequence.durations.push (duration);
        })
        sequence.node_playing_times.forEach (playing_time => {
            new_sequence.playing_time.push (playing_time);
        })
        return new_sequence;
    }

    get x () {
        if (this.playing_sequence) {
            var linie = this.playing_sequence.lines[0];
            if (linie) {return linie.x1 + (linie.x2-linie.x1)*this.local_progress;}
        }
    }

    get y () {
        if (this.playing_sequence) {
            var linie = this.playing_sequence.lines[0];
            if (linie) {return linie.y1 + (linie.y2-linie.y1)*this.local_progress;}
        }
    }

    delete () {
        this.active = false;
        this.svg_element.remove();
        this.playing_sequence = new PACSequence ("", this.visual);
        this.svg_element = null;
    }

    update (elapsed_time) {
        if (this.active) {
            this.local_progress += elapsed_time/this.playing_sequence.durations[0];
            if (this.local_progress >= 1) {
                this.stop ();
                this.fetch();
                this.exec ();
            }
        }
        this.draw ();
    }

    fetch () {
        if (this.playing_sequence.length==1) {
            this.exec_last ();
        }
        this.playing_sequence.shift ();
        this.playing_sequence.stop
        this.local_progress = 0;
        if (this.playing_sequence.length==0) {
            if (this.is_looping) {
                this.reset ();
            }else {
                this.active=false;
            }
        }
    }
 
    reset () {
        if (this.is_pendel) {
            this.stored_sequence.reverse_lines ();
        }
        this.playing_sequence = this.copy_sequence (this.stored_sequence);
        this.local_progress = 0;
    }

    exec_last () {
        this.playing_sequence.play (0, true);
    }

    exec () {
        this.playing_sequence.play (0);
    }

    stop () {
        this.playing_sequence.stop (0);
    }

    erstelle_svg () {
        this.svg_element = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
        this.svg_element.setAttribute ("r", "6")
        this.svg_element.style.stroke = this.color;
        this.svg_element.style.fill = this.color;
        this.svg_element.style.strokeWidth = 5;
        this.svg_container.appendChild(this.svg_element);
        this.draw ();
    }

    draw () {
        if (this.active) {
            this.svg_element.setAttribute("cx",this.x+"%");
            this.svg_element.setAttribute("cy",this.y+"%");
        }
    }

}

