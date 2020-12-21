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
            knotenA.grad += 1; knotenA.verbindungen.push (neueVerbindung);
            knotenB.grad += 1; knotenB.verbindungen.push (neueVerbindung);
            this.verbindungen.push (neueVerbindung);
        }else {
           existierendeVerbindung.starke += 1;
        }
    }

    findeKnoten (id) {
        for (let element of this.knoten){
            if (element.id==id) {
                return element;
            };
        }
        return null;
    }   

    kriegeLetzeVerbindung () {
        if (this.verbindungen.length > 0) {
            return this.verbindungen[this.verbindungen.length-1];
        }
    }

    findeVerbindung (knotenA, knotenB) {
        for (let element of this.verbindungen){
            if ((element.knotenA.id == knotenA.id && element.knotenB.id == knotenB.id) || (element.knotenA.id == knotenB.id && element.knotenB.id == knotenA.id)) {
                return element;
            }
        }
        return null;
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

    finde_alle_pfade (start_knoten, ziel_knoten) {
        var fertige_pfade = [];
        var alle_start_pfade = [];
        start_knoten.verbindungen.forEach (verbindung => {
            var start_pfad = [];
            start_pfad.push (verbindung.ausrichten (start_knoten));
            alle_start_pfade.push (start_pfad);
        })
        this.fuhre_pfade_fort (alle_start_pfade, fertige_pfade, ziel_knoten);
        return fertige_pfade;
    }

    fuhre_pfade_fort (offene_pfade, fertige_pfade, ziel_knoten) {
        var console_text = "";
        offene_pfade.forEach (pfad => {
                if (pfad [pfad.length-1].enthaltKnoten (ziel_knoten)) {
                        fertige_pfade.push (pfad);
                        console.log (this.kriege_pfad_text(pfad))
                } else {
                    var erweiterte_pfade = this.erweitere_pfad (pfad);
                    this.fuhre_pfade_fort (erweiterte_pfade,fertige_pfade,ziel_knoten);
                }
        })
        return fertige_pfade;
    }

    erweitere_pfad (pfad) {
        var anknupf_knoten = pfad[pfad.length-1].knotenB;
        var alle_neuen_verbindungen = anknupf_knoten.verbindungen;
        var erweiterte_pfade = [];

        alle_neuen_verbindungen.forEach (neue_verbindung => {
            var neuer_pfad = [];
            var neuer_pfad_ist_loop = false;
            neue_verbindung = neue_verbindung.ausrichten (anknupf_knoten);
            pfad.forEach (verbindung => {
                if (verbindung.enthaltKnoten (neue_verbindung.knotenB)) {
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

    kriege_pfad_text (pfad) {
        var text = pfad[0].knotenA.name;
        for (var i = 0; i<pfad.length; i++) {
            text = text + "-" + pfad[i].knotenB.name;
        }
        return text;
    }

}   


class Knoten {
    constructor (id, name, parent, level) {
        this.name = name;
        this.id = id;
        this.parent = parent;
        this.level = level;

        this.grad = 0;
        this.verbindungen = [];

        this.url = "";
    }
}

class Verbindung {
    constructor (knotenA, knotenB, starke) {
        this.knotenA = knotenA;
        this.knotenB = knotenB;
        this.starke = 1;
    }

    enthaltKnoten (knoten) {
        if (this.knotenA.id == knoten.id || this.knotenB.id == knoten.id) {
            return true; 
        }else {
            return false;
        }
    }

    umkehren () {
        return new Verbindung (this.knotenB, this.knotenA, this.starke)
    }

    ausrichten (start_knoten) {
        if (this.knotenA==start_knoten) {
            return this;
        }else if (this.knotenB==start_knoten) {
            return this.umkehren();
        }
    }

}