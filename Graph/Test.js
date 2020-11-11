
class ParserTest {
    constructor (parser) {
        this.parser = parser;
    }

    testErstelleGraph (daten, graph) {
        console.log ("---testErstelleGraph()---")
      
        console.log ("Graph Vorher: ")
        console.log (graph);
        console.log ("Eingegebene Daten:")
        console.log (daten);
        this.parser.erstelleGraph (daten, graph);
        console.log ("Graph Nachher:")
        console.log (graph);
    }
        
     testFindeAlleIds (daten) {
         console.log ("-- testFindeAlleIds () --");
         console.log ("daten: ");
         console.log (daten);
         this.testTeileInZeilen (daten, this.parser);
         this.testFindeAlleKnotenIds (daten, this.parser);
         this.testFindeAlleVerbindungIds (daten, this.parser);
     }

     testVerbindungErstellung (testVerbindungId, graph) {
        console.log ("-- testVerbindungErstellung () --");
        console.log ("Alter Graph: ");
        console.log (graph);
        console.log ("Verbindung Id: " + testVerbindungId);
        console.log ("KnotenIds: ")
        var knotenIds = this.parser.kriegeKnotenIdsAusVerbindungId (testVerbindungId)
        console.log (knotenIds);
        this.parser.fügeVerbindungHinzu (testVerbindungId, graph);
        console.log ("Neuer Graph: ");
        console.log (graph);
     }
     
     testKnotenErstellung (testKnotenId, graph) {
        this.testKnotenRegExp (testKnotenId, this.parser);
        this.testExtrahiereIdBasis (testKnotenId, this.parser);
        this.testExtrahiereIdSchwanz (testKnotenId, this.parser);
        this.testFügeAlleKnotenAusIdHinzu (graph, testKnotenId, this.parser);
     }
     
     testTeileInZeilen (daten) {
         console.log ("Parser.teileInZeilen (daten)");
         console.log (this.parser.teileDatenInZeilen (daten));
     }
     
     testFindeAlleKnotenIds (daten) {
         console.log ("Parser.findeAlleKnotenIds (daten)")
         console.log (this.parser.findeAlleKnotenIds (daten))
     }
     
     testFindeAlleVerbindungIds (daten) {
         console.log ("Parser.findeAlleVerbindungsIds (daten)")
         console.log (this.parser.findeAlleVerbindungIds (daten))
     }
     
     testKnotenRegExp (string) {
         var match;
         match = string.match (Daten.knotenRegExp);
         console.log ("-- testKnotenRegExp () --")
         console.log ("string: " + string);
         console.log ("regEx: " + Daten.knotenRegExp);
         console.log ("match: " + match);
     }
     
     testVerbindungRegExp (string) {
         var match;
         match = string.match (Daten.verbindungRegExp);
         console.log ("-- testVerbindungRegExp () --")
         console.log ("string: " + string);
         console.log ("regEx: " + Daten.verbindungRegExp);
         console.log ("match: " + match);
     }

     testKriegeKnotenLevelAusId (id) {
         console.log ("---testKriegeKnotenLevelAusId()");
         console.log ("Id: " + id);
         var level = this.parser.kriegeKnotenLevelAusId (id);
         console.log ("Level: " + level);
     }
     
     testExtrahiereIdBasis (id) {
         console.log ("--testExtrahiereIdBasis()--")
         console.log ("Id: " + id);
         console.log ("IdBasis: " + this.parser.extrahiereIdBasis (id));
     }
     
     testExtrahiereIdSchwanz (id) {
         console.log ("--testExtrahiereIdSchwanz()--")
         console.log ("Id: " + id);
         console.log ("IdSchwanz: " + this.parser.extrahiereIdSchwanz (id));
     }
     
     testFügeAlleKnotenAusIdHinzu (graph, id) {
         console.log ("--testFügeAlleKnotenAusIdHinzu()--")
         console.log ("Graph Davor: ")
         console.log (graph);
         console.log ("Id: " + id)
         this.parser.fügeAlleKnotenAusIdHinzu (graph, id)
         console.log ("Graph danach: ")
         console.log (graph);
     }



}

class GraphTest {
    testKriegeChildren () {

    }
}

class VisualTest {
    constructor (visual) {
        this.visual = visual;
    }
    testErstelleLinie () {
        console.log ("--VisualsTest.testErstelleLinie()---")
        var linie = new Linie (this.visual.punkte[0], this.visual.punkte [1], 1);
    }
    testZeichneAllePunkte (graph) {
        console.log ("--VisualsTest.testZeichneAllePunkte()---")
        this.visual.zeichneAllePunkte (graph);
        console.log (this.visual.punkte);
    }
    testZeichneGraph (graph) {
        console.log ("--VisualsTest.testZeichneAllePunkte()---")
        this.visual.zeichneGraph (graph);
    }
    testKriegeHTMLAttribut (id, attribut) {
        console.log ("--VisualsTest.testKriegeHTMLAttribut();---")
        console.log (this.visual.kriegeHTMLAttribut (id, attribut));
    }
    testKriegeHTMLPosition (id) {
        console.log ("--VisualsTest.testKriegeHTMLPosition();---")
        console.log (Visual.kriegeHTMLPosition (id));
    }
    testVerschiebePunkt (index, x, y) {
        console.log ("--VisualsTest.testVerschiebePunkt();---")
        console.log ("Vorher: Position des Punkt [0]: " + this.visual.punkte[0].x + ", " + this.visual.punkte [0].y)
        this.visual.punkte[index].x = x;
        this.visual.punkte [index].y = x;
        console.log ("Nachher: Position des Punkt [0]: " + this.visual.punkte[0].x + ", " + this.visual.punkte [0].y)
    }
    testErstelleHtml () {
        console.log ("--VisualsTest.testErstelleHtml();---")
        this.visual.erstelleHtml ()
    }
}

class Test {
    constructor (daten, parser, graph, visual) {
        this.daten = daten;
        this.parser = parser;
        this.graph = graph;
        this.visual = visual;
        this.parserTest = new ParserTest (this.parser);
        this.visualTest = new VisualTest (this.visual);
        this.testDaten1 = "berlin.neukolln\nberlin.charlottenburg\nberlin.charlottenburg.sophie\nberlin.kreuzberg\nleipzig.connewitz\nleipzig.norden.merseburgerStr\nwien.yppenplatz\nwien.yppenplatz-berlin.charlottenburg.sophie\nleipzig.norden.merseburgerStr-wien.yppenplatz\nleipzig.norden.merseburgerStr-berlin.charlottenburg.sophie"
        this.testDaten2 = "Escapism.Mercury\nTHEANDAND.48\n\THEANDAND.48.Livestream\nTHEANDAND.Tour\nBab.Album\nBab.dreiecke\nBab.dreiecke.grün\nBab.dreiecke.grau\nBab.dreiecke.blau\nBeyond.Nadja\nBeyond.Felix\nBeyond.Laurenz\nBeyond.Jannis\nBeyond.Tim\nBeyond.Lukas\nBeyond.Konrad"
    }

    test () {
    }
}



