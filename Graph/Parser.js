class Parser {
    constructor () {
        
    }

    erstelleGraph (daten, graph) {
        this.erstelleAlleKnoten (daten, graph);
        this.erstelleAlleVerbindungen (daten, graph);
    }

    erstelleAlleVerbindungen (daten, graph) {
        for (let element of daten.verbindungIds) {
            this.fügeVerbindungHinzu (element, graph);
        }
    }

    erstelleAlleKnoten (daten, graph) {
        for (var i = 0; i<daten.knotenIds.length; i++) {
            var id = daten.knotenIds [i];
            var url = daten.findeUrl (id);
            this.fügeAlleChildrenKnotenHinzu (id, url, graph, null);
        }
    }

    fügeAlleChildrenKnotenHinzu (id, url, graph, parent) {
        var idTeile = this.teileKnotenId (id);
        var knotenName = idTeile [0];
        var knoten = this.erstelleKnoten (parent, knotenName);
        this.fügeKnotenHinzu (graph, knoten, parent);
        if (idTeile[1] != "") {
            this.fügeAlleChildrenKnotenHinzu (idTeile[1], url, graph, knoten);
        }else {
            knoten.url = url; //nur das letzte children kriegt die url zugewiesen
        }
    }

    erstelleKnoten (parentKnoten, name) {
        var knotenId = this.erstelleKnotenId (parentKnoten, name);
        var level = this.kriegeKnotenLevelAusId (knotenId);
        var knoten = new Knoten (knotenId, name, parentKnoten, level);
        return knoten;
    }

    fügeKnotenHinzu (graph, knoten, parent) {
        var existierenderKnoten = graph.findeKnoten (knoten.id);
        if (existierenderKnoten) {
            //was passiert, wenn ein knoten hinzugefügt wird, der sich nur durch die url unterscheidet?
        }else {
            graph.addKnoten (knoten);
            this.erstelleVerbindungZuParent (knoten, parent, graph);
        }
    }

    fügeVerbindungHinzu (verbindungsId, graph) {
        var knotenIds = this.kriegeKnotenIdsAusVerbindungId (verbindungsId);
        var knotenA = graph.findeKnoten (knotenIds [0]);
        var knotenB = graph.findeKnoten (knotenIds[1]);
        if (knotenA && knotenB != null) {
            graph.addVerbindung (knotenA, knotenB);
        }   
    }


    erstelleVerbindungZuParent (knoten, parentKnoten, graph) {
        if (parentKnoten) {
            graph.addVerbindung (knoten, parentKnoten);
        }
    }

    erstelleKnotenId (parentKnoten, id) {
        var parentId = this.kriegeKnotenIdAusKnoten (parentKnoten);
        var knotenId =  parentId + "." + id;
        return knotenId;
    }

    kriegeKnotenIdAusKnoten (knoten) {
        if (knoten != null) {
            return knoten.id;
        }else {
            return "";
        }
    }

    kriegeKnotenLevelAusId (id) {
        var idBestandteile = id.split (".")
        if (idBestandteile != null) {
            return idBestandteile.length-1;
        }else {
            return 0;
        }
    }

    teileKnotenId (id) {
        var idBasis = this.extrahiereIdBasis (id);
        var idSchwanz = this.extrahiereIdSchwanz (id);
        if (idBasis == "") {
            idBasis = id;
        }
        var idTeile = [idBasis, idSchwanz];
        return idTeile;
    }

    kriegeKnotenIdsAusVerbindungId (verbindungId) {
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

    extrahiereIdBasis (id) {
        var idBestandteile = id.match (Daten.knotenRegExp);
        if (idBestandteile != null) {
            return idBestandteile[1];
        }else {
            return "";
        }
    }

    extrahiereIdSchwanz (id) {
        var idBestandteile = id.match (Daten.knotenRegExp);
        if (idBestandteile != null) {
        return idBestandteile[2];
        }else {
            return "";
        }
    }

   
}