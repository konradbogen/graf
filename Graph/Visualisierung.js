//PLUGIN FÜR GRAPH
const DEFAULT_LINE_COLOUR = "grey";
const UPDATE_RATE = 1000/120;
const styleXYRegEx = /top:(\d*.*d*)%;\sleft:(\d*.*d*)%;/
const FARBEN = ["blue", "red", "yellow", "puple", "green", "orange", "pink", "brown", "white"]
const OPACITY = 0.5;

class Linie {
    constructor (punkt1, punkt2, dicke) {
        this.punkt1 = punkt1;
        this.punkt2= punkt2;
        this.punkt1.positionWurdeGeändert = this.callback.bind (this);
        this.punkt2.positionWurdeGeändert = this.callback.bind (this);
        this.dicke = dicke;
        this.html = this.erstelleHTML ();
    }

    get x1 () {
        return this.punkt1.x;
    }
    get y1 () {
        return this.punkt1.y;
    }
    get x2 () {
        return this.punkt2.x;
    }
    get y2 () {
        return this.punkt2.y;
    }

    callback () {
        this.aktualisiereHTMLPosition ();
        console.log ("callback");
    }
    
    erstelleHTML () {
        var svg = document.getElementById ("graphSvg");
        var linie = document.createElementNS("http://www.w3.org/2000/svg", 'line')
        linie.setAttribute("x1",this.x1+"%");
        linie.setAttribute("y1",this.y1+"%");
        linie.setAttribute("x2",this.x2+"%");
        linie.setAttribute("y2",this.y2+"%");
        linie.style.stroke = DEFAULT_LINE_COLOUR;
        linie.style.strokeOpacity = OPACITY;
        linie.style.strokeWidth = this.dicke*2;
        svg.appendChild(linie);
        return linie;
    }

    aktualisiereHTMLPosition () {
        this.html.setAttribute("x1",this.x1+"%");
        this.html.setAttribute("y1",this.y1+"%");
        this.html.setAttribute("x2",this.x2+"%");
        this.html.setAttribute("y2",this.y2+"%"); 
    }

}

class Punkt {
    constructor (x, y, name, url, id, level) {
        this._x = x;
        this._y = y;
        this.name = name;
        this.id = id;
        this.level = level;
        this.url = url;
        this.html = this.erstelleHTML ();
        this.erstelleObserver ();
        
    }

    get istLink () {
        if (this.url != "") {
            return true;
        }else {
            return false;
        }
    }
    
    set x (value) {
        this.änderePosition (value, this._y);
    }

    set y (value) {
        this.änderePosition (this._x, value);
    }

    get x () {
        return this._x;
    }
    get y () {
        return this._y;
    }

    get absolutePosition () {
        var pos = $(this.html).offset();
        return pos;
    }

    änderePosition (newX, newY) {
        this._x = newX; this._y = newY;
        this.aktualisiereHTMLPosition ();
    }

    aktualisiereHTMLPosition () {
        this.html.setAttribute("style", "top:"+this._y+"%; left:"+this._x+"%;");
    }

    erstelleHTML () {
        var e = document.createElement("h"+this.level);
        var container = document.getElementsByClassName ("graphContainer") [0];
        if (this.url == "") {
            e.innerHTML = this.name;
        }else {
            e.innerHTML = "<a href="+this.url+">" + this.name + "</a>"
        }
        e.setAttribute("id", this.id)
        e.setAttribute("style", "top:"+this._y+"%; left:"+this._x+"%;");
        container.appendChild (e);
        return e;
    };

    erstelleObserver (callback) {
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
            var pos = Visual.kriegePositionAusStyle (style);
            this._x = pos [0];
            this._y = pos [1];
            this.positionWurdeGeändert ();
        }    
    }

    play () {
        //je nach datentyp audio abspielen, bild anzeigen, etc.
    }

    stop () {
        //je nach datentyp bild entfernen, audio stoppen, etc.
    }

    positionWurdeGeändert () {

    }

}

class Visual {
    
    constructor () {
        this.timer = setInterval (this.update_pacs.bind (this), UPDATE_RATE)
        this.punkte = [];
        this.linien = [];
        this.pacs = [];
        this.sequenzen = [];
        this.container;
        this.svg;
        this.verknüpfeMitHtmlDatei ();
    }

    update_pacs () {
        this.pacs.forEach (pac=>{
            pac.update (UPDATE_RATE);
        });
    }
    zeichneGraph (g) {
        this.leereHtml ();
        this.zeichneAlleKnoten (g);
        this.zeichneAlleVerbindungen (g);
    }

    zeichne_sequenzen () {
        this.sequenzen.forEach (seq => {
            seq.show ();
        })
    }

    erstelleHtml () {
        var masterContainer = document.getElementsByClassName ("flexContainer") [0]
        this.container = document.createElement ("div");
        this.svg = document.createElement ("svg");
        this.container.setAttribute ("class", "graphContainer");
        this.svg.setAttribute ("id", "graphSvg");
        masterContainer.appendChild (this.container);
        this.container.appendChild (this.svg);
    }

    verknüpfeMitHtmlDatei () {
        this.container = document.getElementsByClassName ("graphContainer") [0];
        this.svg = document.getElementById ("graphSvg");
    }

    leereHtml () {
        this.svg.innerHTML = "";
        this.container.innerHTML = "";
        this.container.appendChild (this.svg);
    }

    zeichneAlleKnoten (graph) {
        this.zeichneChildrenKnoten (graph,null, 50, 50, 30);
    }

    zeichneAlleVerbindungen (graph) {
        graph.verbindungen.forEach(element => {
            this.zeichneVerbindung (element);
        });
    }

    zeichneChildrenKnoten (graph, parentKnoten, xZentrum, yZentrum, radius) {
        var children = graph.kriegeChildren (parentKnoten);
        for (var i=0; i<children.length; i++) {
            var knoten = children [i];
            var winkel = i * (2*Math.PI / children.length);
            var { x, y } = this.kriegeKoordinatenAufKreis (xZentrum, yZentrum, radius, winkel);
            this.zeichneKnoten (x,y, knoten)
            this.zeichneChildrenKnoten(graph, knoten, x, y, radius/2);
        }
    }

    zeichneKnoten (x,y, knoten) {
        var p = new Punkt (x,y, knoten.name, knoten.url, knoten.id, knoten.level);
        this.punkte.push (p);
    }

   

    zeichneVerbindung (verbindung) {
        var _punkte = this.kriegePunkteAusVerbindung (verbindung);
        if (_punkte != null) {
            var linie = new Linie (_punkte [0], _punkte [1], 1);
            linie.verbindung = verbindung;
            this.linien.push (linie);
        }
    }

    kriegePunkteAusVerbindung (verbindung) {
        var id1 = verbindung.knotenA.id;
        var id2 = verbindung.knotenB.id;
        var punkt1 = this.findePunkt (id1);
        var punkt2 = this.findePunkt (id2);
        if (punkt1 != null && punkt2 != null) {
            return [punkt1, punkt2] 
        }else {
            return null;
        }
    }

    kriegeKoordinatenAufKreis (xZentrum, yZentrum, radius, winkel) {
        var x = xZentrum + radius * Math.cos(winkel);
        var y = yZentrum + radius * Math.sin(winkel);
        return { x, y };
    }

    findePunkt (id) {
        for (var i = 0; i<this.punkte.length; i++) {
            if (this.punkte[i].id == id) {
                return this.punkte[i];
            }
        }
    }

    finde_linie (punkt1_id, punkt2_id) {
        for (var i = 0; i<this.linien.length; i++) {
            if (this.linien[i].punkt1.id == punkt1_id && this.linien[i].punkt2.id == punkt2_id) {
                return this.linien[i];
            }
        }
    }

    static kriegePositionAusStyle (style) {
        var match = style.match (styleXYRegEx);
        var top = match [1]; 
        var left = match [2];
        return [left, top];

    }

    static kriegeHTMLAttribut (id, attribut) {
        let element = document.getElementById(id);
        var wert = element.getAttribute(attribut)
        return wert;
    }

    static kriegeHTMLPosition (id) {
        var style = this.kriegeHTMLAttribut (id, "style");
        var pos = this.kriegePositionAusStyle (style);
        return pos;
    }


}







