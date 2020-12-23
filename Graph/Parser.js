//PLUG-IN FÜR GRAPH.JS, DATEN.JS, PAC.JS

class Parser {
    constructor () {
        
    }

    erstelle_graph (daten, graph) {
        this.erstelle_alle_knoten (daten, graph);
        this.erstelle_alle_verbindungen (daten, graph);
    }

    erstelle_alle_sequenzen (daten, graph, visual) {
        for (let element of daten.seq_ids) {
            this.fuge_sequenz_hinzu (element, graph, visual);
        }
    }

    erstelle_alle_pacs (daten, visual) {
        for (let element of daten.pac_ids) {
            this.fuge_pac_hinzu (element, visual);
        }
    }

    erstelle_alle_verbindungen (daten, graph) {
        for (let element of daten.verbindung_ids) {
            this.fuge_verbindung_hinzu (element, graph);
        }
    }

    erstelle_alle_knoten (daten, graph) {
        for (var i = 0; i<daten.knoten_ids.length; i++) {
            var id = daten.knoten_ids [i];
            var url = daten.finde_url (id);
            this.fuge_alle_children_knoten_hinzu (id, url, graph, null);
        }
    }

    fuge_alle_children_knoten_hinzu (id, url, graph, parent) {
        var idTeile = this.teile_knoten_id (id);
        var knotenName = idTeile [0];
        var knoten = this.erstelle_knoten (parent, knotenName);
        this.fuge_knoten_hinzu (graph, knoten, parent);
        if (idTeile[1] != "") {
            this.fuge_alle_children_knoten_hinzu (idTeile[1], url, graph, knoten);
        }else {
            knoten.url = url; //nur das letzte children kriegt die url zugewiesen
        }
    }

    erstelle_knoten (parent_knoten, name) {
        var knotenId = this.erstelle_knoten_id (parent_knoten, name);
        var level = this.kriege_knoten_level_aus_id (knotenId);
        var knoten = new Knoten (knotenId, name, parent_knoten, level);
        return knoten;
    }

    fuge_pac_hinzu (id, visual) {
        var name = id.substring (5);
        visual.sequenzen.forEach(seq => {
            if (seq.name == name) {
                var pac = new Pac (seq, seq.farbe);
                visual.pacs.push (pac);
            }
        });
    }

    teile_seq_id (id) {
        var id_ohne_anfang = id.substring (5);
        var id_teile = id_ohne_anfang.split (" ")
        return id_teile;
    }

    fuge_sequenz_hinzu (id, graph, visual) {
        var id_teile = this.teile_seq_id (id);
        var name = id_teile [0];
        if (name) {
            var seq = this.erstelle_sequenz_aus_id_teilen(name, id_teile, graph, visual);
            for (var i = 0; i<FARBEN.length;i++) {
                if (name.includes (FARBEN [i])) {
                    seq.farbe = FARBEN [i];
                }
            }
            visual.sequenzen.push (seq);
        }
    }

    erstelle_sequenz_aus_id_teilen(name, id_teile, graph, visual) {
        var sequenz = new Sequenz(name, visual);
        for (var i = 1; i < id_teile.length - 1; i += 2) {
            var dauer = id_teile[i+1];
            var verbindung_id = id_teile[i]
            var knoten_ids = this.kriege_knoten_id_aus_verbindung_id(verbindung_id);
            var verbindung = graph.finde_verbindung(knoten_ids[0], knoten_ids[1]);
            if (verbindung && DAUER_REGEXP.test(dauer)) {
                sequenz.push (verbindung, dauer*1000);
            }
        }
        return sequenz;
    }

    fuge_knoten_hinzu (graph, knoten, parent) {
        var existierenderKnoten = graph.findeKnoten (knoten.id);
        if (existierenderKnoten) {
            //was passiert, wenn ein knoten hinzugefügt wird, der sich nur durch die url unterscheidet?
        }else {
            graph.addKnoten (knoten);
            this.erstelle_verbindung_zu_parent (knoten, parent, graph);
        }
    }

    fuge_verbindung_hinzu (verbindungsId, graph) {
        var knotenIds = this.kriege_knoten_id_aus_verbindung_id (verbindungsId);
        var knotenA = graph.findeKnoten (knotenIds [0]);
        var knotenB = graph.findeKnoten (knotenIds[1]);
        if (knotenA && knotenB != null) {
            graph.addVerbindung (knotenA, knotenB);
        }   
    }


    erstelle_verbindung_zu_parent (knoten, parent_knoten, graph) {
        if (parent_knoten) {
            graph.addVerbindung (knoten, graph.findeKnoten(parent_knoten.id));
        }
    }

    erstelle_knoten_id (parent_knoten, id) {
        var parentId = this.kriege_knoten_id_aus_knoten (parent_knoten);
        var knotenId =  parentId + "." + id;
        return knotenId;
    }

    kriege_knoten_id_aus_knoten (knoten) {
        if (knoten != null) {
            return knoten.id;
        }else {
            return "";
        }
    }

    kriege_knoten_level_aus_id (id) {
        var idBestandteile = id.split (".")
        if (idBestandteile != null) {
            return idBestandteile.length-1;
        }else {
            return 0;
        }
    }

    teile_knoten_id (id) {
        var idBasis = this.extrahie_knoten_id_basis (id);
        var idSchwanz = this.extrahie_knoten_id_schwanz (id);
        if (idBasis == "") {
            idBasis = id;
        }
        var idTeile = [idBasis, idSchwanz];
        return idTeile;
    }

    kriege_knoten_id_aus_verbindung_id (verbindungId) {
        var idBestandteile = verbindungId.split ("-");
        var knotenIds = [];
        if (idBestandteile != null) {
            for (let element of idBestandteile) {
                var id = "." + element;
                knotenIds.push (id);
            }
        }
        return knotenIds;
    }

    extrahie_knoten_id_basis (id) {
        var idBestandteile = id.match (Daten.KNOTEN_REGEXP);
        if (idBestandteile != null) {
            return idBestandteile[1];
        }else {
            return "";
        }
    }

    extrahie_knoten_id_schwanz (id) {
        var idBestandteile = id.match (Daten.KNOTEN_REGEXP);
        if (idBestandteile != null) {
        return idBestandteile[2];
        }else {
            return "";
        }
    }

   
}