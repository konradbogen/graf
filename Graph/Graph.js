class Graph {
    constructor () {
        this.knoten = [];
        this.verbindungen = [];
    }

    addKnoten (neuerKnoten) {
        this.knoten.push (neuerKnoten);
    }

    addVerbindung (knotenA, knotenB) {
        var existierendeVerbindung = this.findeVerbindung (knotenA, knotenB);
        if (existierendeVerbindung == null) {
            var neueVerbindung = new Verbindung (knotenA, knotenB, 1);
            this.verbindungen.push (neueVerbindung);
        }else {
           existierendeVerbindung.stärke += 1;
        }
    }

    findeKnoten (id) {
        for (let element of this.knoten){
            if (element.id==id) {
                return element;
            };
        }
    }   

    findeVerbindung (knotenA, knotenB) {
        for (let element of this.verbindungen){
            if (element.knotenA == knotenA && element.knotenB == knotenB) {
                return element;
            }
        }
    }
    
    kriegeLevel (level) {
        var knoten = [];
        for (let element of this.knoten){
            if (element.level==level) {
                knoten.push (element);
            };
        }
        return knoten;
    }

    kriegeChildren (parentKnoten) {
        if (parentKnoten) {
            var children = [];
            this.knoten.forEach(element => {
                if (element.parent) {
                    if (element.parent.id == parentKnoten.id) {
                        children.push (element);
                    }
                }
            });
            return children;
        }else {
            return this.kriegeLevel (1);
        }
    }

}   

class Knoten {
    constructor (id, name, parent, level) {
        this.name = name;
        this.id = id;
        this.parent = parent;
        this.level = level;
    }
}

class Verbindung {
    constructor (knotenA, knotenB, stärke) {
        this.knotenA = knotenA;
        this.knotenB = knotenB;
        this.stärke = 1;
    }
}