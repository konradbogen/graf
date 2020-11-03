class Parser {
    constructor () {
        
    }

    erstelleGraph (daten, graph) {
        this.erstelleAlleKnoten (daten, graph);
        this.erstelleAlleVerbindungen (daten, graph);
    }

    erstelleAlleVerbindungen (daten, graph) {
        var idList = this.findeAlleVerbindungIds (daten);
        for (let element of idList) {
            this.fügeVerbindungHinzu (element, graph);
        }
    }

    erstelleAlleKnoten (daten, graph) {
        var idList = this.findeAlleKnotenIds (daten);
        for (let element of idList) {
            this.fügeAlleKnotenAusIdHinzu (graph, element);
        }
    }

    findeAlleKnotenIds (daten) {
        var knotenIds = [];
        knotenIds = this.findeIdInDaten (daten, Daten.knotenRegExp);
        return knotenIds;
    }

    findeAlleVerbindungIds (daten) {
        var verbindungIds;
        verbindungIds = this.findeIdInDaten (daten, Daten.verbindungRegExp);
        return verbindungIds;
    }

    fügeAlleKnotenAusIdHinzu (graph, id, parentKnoten) {
        var idTeile = this.teileKnotenId (id);
        var knotenName = idTeile [0];
        var knoten = this.fügeKnotenHinzu (parentKnoten, knotenName, graph);
        if (idTeile[1] != "") {
            this.fügeAlleKnotenAusIdHinzu (graph, idTeile[1], knoten)
        }
    }

    fügeKnotenHinzu (parentKnoten, name, graph) {
        var knotenId = this.erstelleKnotenId (parentKnoten, name);
        var knoten = this.erstelleKnoten (knotenId, name, parentKnoten);
        if (graph.findeKnoten (knotenId) == null) {
            graph.addKnoten (knoten);
            this.erstelleVerbindungZuParent (knoten, parentKnoten, graph);
        }
        return knoten;
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
        if (parentKnoten != null) {
            graph.addVerbindung (knoten, parentKnoten);
        }
    }

    erstelleKnoten (knotenId, name, parentKnoten) {
        var level = this.kriegeKnotenLevelAusId (knotenId);
        var knoten = new Knoten (knotenId, name, parentKnoten, level);
        return knoten;
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

    findeIdInDaten (daten, regEx) {
        var zeilen = this.teileDatenInZeilen (daten);
        var idListe = [];
        for (let element of zeilen) {
            if (regEx.test (element)) {idListe.push (element)};
        }
        return idListe;
    }

    teileDatenInZeilen (daten) {
        var zeilen = daten.split ("\n");
        return zeilen;
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