const knotenRegExp = /^(?:(\w+)\.)((?:\w+\.)*(?:\w+))$/;
const verbindungRegExp = /^((?:\w+\.*)(?:\w+\.*\w+)*)-((?:\w+\.*)(?:\w+\.*\w+)*)$/;

class Daten {
    constructor () {
        this.quelle = "Knoten.Child1\nKnoten.Child2\nKnoten.Child1-Knoten.Child2";
    }

    static get knotenRegExp () {
        return knotenRegExp;
    }

    static get verbindungRegExp () {
        return verbindungRegExp;
    }
}

