//PLUGIN FÜR VISUALISIERUNG UND GRAPH

class Sequenz {
    constructor (visualisierung) {
        this.verbindungen = [];
        this.linien = [];
        this.dauern = [];
        this.visualisierung = visualisierung;
    }
    
    get length () {
        return this.verbindungen.length;
    }

    show (farbe) {
        this.linien.forEach (linie => {
            linie.html.style.stroke = farbe;
            linie.html.style.strokeWidth = linie.dicke*4;
        })
    }

    hide () {
        this.linien.forEach (linie => {
            linie.html.style.stroke = DEFAULT_LINE_COLOUR;
            linie.html.style.strokeWidth = linie.dicke*2;
        })
    }

    play (index) {
        if (index < this.linien.length) {
            this.linien[index].punkt1.play ();
        }
    }

    push (verbindung, dauer) {
        this.verbindungen.push (verbindung);
        var linie = this.visualisierung.finde_linie (verbindung.knotenA.id, verbindung.knotenB.id)
        this.linien.push (linie);
        this.dauern.push (dauer);
    }

    shift () {
        this.verbindungen.shift ();
        this.linien.shift ();
        this.dauern.shift ();
    }

}


class PAC {
    constructor (sequenz, farbe) {
        this.sequenz = sequenz;
        this.farbe = farbe;
        this.fortschritt = 0;
        this.aktiv = true;
        this.svg_container = sequenz.visualisierung.svg;
        this.svg_element;
        this.erstelle_svg ();
        this.exec ();
    }

    get x () {
        if (this.sequenz) {
            var linie = this.sequenz.linien[0];
            return linie.x1 + (linie.x2-linie.x1)*this.fortschritt;
        }
    }

    get y () {
        if (this.sequenz) {
            var linie = this.sequenz.linien[0];
            return linie.y1 + (linie.y2-linie.y1)*this.fortschritt;
        }
    }

    delete () {
        this.active = false;
        this.sequenz = new Sequenz ();
        this.svg_element = null;
    }

    update (vergangene_zeit) {
        if (this.aktiv) {
            this.fortschritt += vergangene_zeit/this.sequenz.dauern[0];
            console.log ("fortschritt: " + this.fortschritt)
            if (this.fortschritt >= 1) {
                this.exec ();
                this.fetch();
            }
        }
        this.draw ();
    }

    fetch () {
        this.sequenz.shift ();
        this.fortschritt = 0;
        if (this.sequenz.length==0) {
            this.aktiv=false;
        }
    }

    exec () {
        this.sequenz.play (0);
    }

    erstelle_svg () {
        this.svg_element = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
        this.svg_element.setAttribute ("r", "10")
        this.svg_element.style.stroke = "yellow";
        this.svg_element.style.strokeWidth = 5;
        this.svg_container.appendChild(this.svg_element);
        this.draw ();
    }

    draw () {
        if (this.aktiv) {
            this.svg_element.setAttribute("cx",this.x+"%");
            this.svg_element.setAttribute("cy",this.y+"%");
        }
    }

}