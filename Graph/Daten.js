const knotenRegExp = /^(?:(\w+))\.*((?:\.*\w+)*(?:\w+)*)$/;
const verbindungRegExp = /^((?:\w*\.*)(?:\w+\.*\w+)*)-((?:\w*\.*)(?:\w+\.*\w+)*)$/;
const dateiEndungRegExp = /\.[a-zA-Z]*/;
const VERZEICHNIS = "http://www.heptagon.network/Graph/Content/"


class Daten {
    constructor () {
        this.knotenIds = [];
        this.verbindungIds = [];
        this.urls = [];
    }

    static get knotenRegExp () {
        return knotenRegExp;
    }

    static get verbindungRegExp () {
        return verbindungRegExp;
    }

    leseVerzeichnisAus (erstelleKnoten) {
        this.urls = [];
        var array = [];
        array = this.requestPHPDirectory(array);
        array.forEach(element => {
            if (element != false) { //JSON gibt manchmal ein false mit
                var dateiname = new String (element);
                if (dateiname != "." && dateiname != null && dateiname != "..") {
                    this.fügeDateiHinzu(dateiname, erstelleKnoten);
                }
            }
        });
    }

    requestPHPDirectory(array) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "FileSystem.php", false);
        xmlhttp.send(null);
        if (xmlhttp.status == 200) {
            var response = xmlhttp.responseText;
            if (response != "" && response != "\n") {
                array = JSON.parse(response);
            }
        }
        return array;
    }

    fügeDateiHinzu(dateiname, erstelleKnoten) {
        var id = this.erstelleIdAusDateiname(dateiname);
        if (erstelleKnoten) {
            this.knotenIds.push(id);
        }
        this.urls.push(VERZEICHNIS + dateiname);
    }

    erstelleIdAusDateiname (dateinameString) {
        var stringOhneDateityp = dateinameString.substr (0, dateinameString.lastIndexOf (".")) || null;
        return stringOhneDateityp;
    }

    erstelleDateinameAusUrl (urlString) {
        var stringOhneVerzeichnis = urlString.substr (VERZEICHNIS.length, urlString.length);
        return stringOhneVerzeichnis;
    }

    erstelleIdAusUrl (urlString) {
        var dateinameString = this.erstelleDateinameAusUrl (urlString);
        var id = this.erstelleIdAusDateiname (dateinameString);
        return id;
    }

    findeUrl (id) {
        for (var i = 0; i<this.urls.length;i++) {
            var url = this.urls [i];
            if (this.erstelleIdAusUrl (url) == id) {
                return url;
            }
        }
        return "";
    }

    leseEingabeAus (eingabe) {
        this.knotenIds = [];
        this.verbindungIds = [];
        this.erstelleKnotenIdsAusEingabe (eingabe);
        this.erstelleVerbindungsIdsAusEingabe (eingabe);
    }

    kriegeEingabeText () {
        var text = "";
        if (this.knotenIds) {
            this.knotenIds.forEach(element => {
                text = text + element + "\n";
            });
        }
        if (this.verbindungsIds) {
            this.verbindungsIds.forEach (element => {
                text = text + element + "\n";
            });
        }
        return text;
    }


    erstelleKnotenIdsAusEingabe (eingabe) {
        this.knotenIds = this.findeIdRegExp (eingabe, knotenRegExp);
        return this.knotenIds;
    }


    erstelleVerbindungsIdsAusEingabe (eingabe) {
        this.verbindungIds = this.findeIdRegExp (eingabe, verbindungRegExp);
        return this.verbindungIds;
    }

    findeIdRegExp (eingabe, regEx) {
        var zeilen = this.teileInZeilen (eingabe);
        var idListe = [];
        for (let element of zeilen) {
            if (regEx.test (element)) {idListe.push (element)};
        }
        return idListe;
    }

    teileInZeilen (eingabe) {
        var zeilen = eingabe.split ("\n");
        return zeilen;
    }


}

