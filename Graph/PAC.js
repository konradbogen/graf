//PLUGIN FÜR VISUAL

class Sequence {
    constructor (name) {
        this.name = name;
        this.color = "white";
        this.lines = [];
        this.durations = [];
        this.visual;
    }
    
    get length () {
        return this.lines.length;
    }

    show () {
        this.lines.forEach (linie => {
            linie.html.style.stroke = this.color;
            linie.html.style.strokeWidth = linie.strength*4;
        })
    }

    hide () {
        this.lines.forEach (linie => {
            linie.html.style.stroke = DEFAULT_LINE_COLOUR;
            linie.html.style.strokeWidth = linie.dicke*2;
        })
    }

    play (index) {
        if (index < this.lines.length) {
            this.lines[index].point_a.play ();
        }
    }

    stop (index) {
        if (index < this.lines.length) {
            this.lines[index].point_a.stop ();
        }
    } 

    push (node_ids, dauer) {
        this.durations.push (dauer);
        var line = this.visual.find_line (node_ids [0], node_ids [1])
        if (line) {
            this.lines.push (line);
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
        this.speed = 10;
        this.timer = setInterval (this.update_pacs.bind (this), UPDATE_RATE)
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

}

class Pac {
    constructor (sequence, color) {
        this.sequence = sequence;
        this.color = color;
        this.local_progress = 0;
        this.active = true;
        this.svg_container = sequence.visual.svg;
        this.svg_element;
        this.erstelle_svg ();
        this.exec ();
    }

    get x () {
        if (this.sequence) {
            var linie = this.sequence.lines[0];
            return linie.x1 + (linie.x2-linie.x1)*this.local_progress;
        }
    }

    get y () {
        if (this.sequence) {
            var linie = this.sequence.lines[0];
            return linie.y1 + (linie.y2-linie.y1)*this.local_progress;
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