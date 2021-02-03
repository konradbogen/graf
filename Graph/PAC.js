//PLUGIN FÜR VISUAL
const UPDATE_RATE = 1000/120;
const DEFAULT_LINE_COLOUR = "white";

class Sequence {
    constructor (name) {
        this.name = name;
        this.color = "white";
        this.lines = [];
        this.durations = [];
        this.node_playing_times = [];
        this.visual;
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

    show () {
        this.lines.forEach (line => {
            this.show_line (line);
        })
    }

    show_line (line) {
        line.html.style.stroke = this.color;
        line.html.style.strokeWidth = line.strength*4;
    }

    hide () {
        this.lines.forEach (linie => {
            linie.html.style.stroke = DEFAULT_LINE_COLOUR;
            linie.html.style.strokeWidth = linie.dicke*2;
        })
    }

    play (index) {
        if (index < this.lines.length) {
            var point = this.lines[index].point_a;
            if (point.node.name != RECORD_COMMAND) {
                point.play ();
            }
        }
    }

    stop (index) {
        if (index < this.lines.length) {
            this.lines[index].point_a.stop ();
        }
    } 

    push (node_ids, duration, show) {
        this.durations.push (duration);
        var line = this.visual.find_line (node_ids [0], node_ids [1])
        if (line == null) {
            var node_a = this.visual.graph.find_node (node_ids [0]);
            var node_b = this.visual.graph.find_node (node_ids [1]);
            var edge = this.visual.graph.add_edge (node_a, node_b);
            line = this.visual.create_line (edge);
        }
        this.lines.push (line);
        this.show_line (line);
    }

    add_point (point, duration) { 
        if (this.last_point) {
            this.push ([this.last_point.node.id, point.node.id], duration);
        }else {
            this.push ([point.node.id, point.node.id], duration);
        }
    }

    shift () {
        this.lines.shift ();
        this.durations.shift ();
    }

}

class PACSystem {
    constructor (visual, graph) {
        this.visual = visual;
        this.pacs = [];
        this.sequences = [];
        this.date = new Date(); 
        this.last_date = new Date ();
        this.is_recording = false;
        this.init_recorded_sequence ();
        this.sequences [0] = this.recorded_sequence;
        this.speed = 10;
        this.timer = setInterval (this.update_pacs.bind (this), UPDATE_RATE)
        this.visual.callbacks_point_play.push (this.add_recorded_point.bind (this));
    }

    delete_all_pacs () {
        this.pacs.forEach (pac => {
            pac.svg_element.remove();
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
            var duration = (this.date - this.last_date) * 10;
            this.last_date = this.date;
            this.recorded_sequence.add_point (point, duration);
        }
    }

    init_recorded_sequence () {
        if (this.recorded_sequence) {this.recorded_sequence.hide ();};
        this.recorded_sequence = new Sequence ("recorded"); 
        this.recorded_sequence.visual = this.visual;
        this.recorded_sequence.color = "red";
    }

    play_recorded () {
        this.stop_recording ();
        var pac = new PAC (this.recorded_sequence, "red");
        this.pacs.push (pac);
    }

    start_recording () {
        this.date = null; this.last_date = null;
        this.init_recorded_sequence ();
        this.is_recording = true;
    }

    stop_recording () {
        this.is_recording = false;
        this.recorded_sequence.show ();
    }

}

class PAC {
    constructor (sequence, color) {
        this.sequence = this.copy_sequence (sequence);
        this.color = color;
        this.local_progress = 0;
        this.active = true;
        this.svg_container = sequence.visual.svg;
        this.svg_element;
        this.erstelle_svg ();
        this.exec ();
    }

    copy_sequence (sequence) {
        var new_sequence = new Sequence (sequence.name, sequence.color)
        new_sequence.visual = sequence.visual;
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
        if (this.sequence) {
            var linie = this.sequence.lines[0];
            if (linie) {return linie.x1 + (linie.x2-linie.x1)*this.local_progress;}
        }
    }

    get y () {
        if (this.sequence) {
            var linie = this.sequence.lines[0];
            if (linie) {return linie.y1 + (linie.y2-linie.y1)*this.local_progress;}
        }
    }

    delete () {
        this.active = false;
        this.sequence = new Sequence ();
        this.svg_element = null;
    }

    update (elapsed_time) {
        if (this.active) {
            this.local_progress += elapsed_time/this.sequence.durations[0];
            if (this.local_progress >= 1) {
                this.stop ();
                this.fetch();
                this.exec ();
            }
        }
        this.draw ();
    }

    fetch () {
        this.sequence.shift ();
        this.sequence.stop
        this.local_progress = 0;
        if (this.sequence.length==0) {
            this.active=false;
        }
    }

    exec () {
        this.sequence.play (0);
    }

    stop () {
        this.sequence.stop (0);
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