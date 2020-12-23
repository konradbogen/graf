const KNOTEN_REGEXP = /^(?:(\w+))\.*((?:\.*\w+)*(?:\w+)*)$/;
const VERBINDUNG_REGEXP = /^((?:\w*\.*)(?:\w+\.*\w+)*)-((?:\w*\.*)(?:\w+\.*\w+)*)$/;
const DAUER_REGEXP = /^(\d*)$/
const DATEI_ENDUNG_REGEXP = /\.[a-zA-Z]*/;
const SEQ_REGEXP = />seq\s(\w*)\s.*/;
const PAC_REGEXP = />pac (.*)/;


const VERZEICHNIS = "http://www.heptagon.network/Graph/Content/"

class Daten {
    constructor () {
        this.seq_ids = [];
        this.pac_ids = [];
        this.knoten_ids = [];
        this.verbindung_ids = [];
        this.urls = [];
    }

    static get KNOTEN_REGEXP () {
        return KNOTEN_REGEXP;
    }
 
    static get VERBINDUNG_REGEXP () {
        return VERBINDUNG_REGEXP;
    }

    lese_verzeichnis_aus (erstelleKnoten) {
        this.urls = [];
        var array = [];
        array = this.request_php_verzeichnis (array);
        array.forEach(element => {
            if (element != false) { //JSON gibt manchmal ein false mit
                var dateiname = new String (element);
                if (dateiname != "." && dateiname != null && dateiname != "..") {
                    this.fuge_datei_hinzu(dateiname, erstelleKnoten);
                }
            }
        });
    }

    request_php_verzeichnis (array) {
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

    fuge_datei_hinzu (dateiname, erstelleKnoten) {
        var id = this.erstelle_id_aus_dateiname(dateiname);
        if (erstelleKnoten) {
            this.knoten_ids.push(id);
        }
        this.urls.push(VERZEICHNIS + dateiname);
    }

    erstelle_id_aus_dateiname (dateinameString) {
        var stringOhneDateityp = dateinameString.substr (0, dateinameString.lastIndexOf (".")) || null;
        return stringOhneDateityp;
    }

    erstelle_dateiname_aus_url (urlString) {
        var stringOhneVerzeichnis = urlString.substr (VERZEICHNIS.length, urlString.length);
        return stringOhneVerzeichnis;
    }

    erstelle_knoten_id_aus_url (urlString) {
        var dateinameString = this.erstelle_dateiname_aus_url (urlString);
        var id = this.erstelle_id_aus_dateiname (dateinameString);
        return id;
    }

    finde_url (knoten_id) {
        for (var i = 0; i<this.urls.length;i++) {
            var url = this.urls [i];
            if (this.erstelle_knoten_id_aus_url (url) == knoten_id) {
                return url;
            }
        }
        return "";
    }

    lese_eingabe_aus (eingabe) {
        this.knoten_ids = [];
        this.verbindung_ids = [];
        this.erstelle_knoten_ids_aus_eingabe (eingabe);
        this.erstelle_verbindungs_ids_aus_eingabe (eingabe);
        this.erstelle_pac_ids_aus_eingabe (eingabe);
        this.erstelle_seq_ids_aus_eingabe (eingabe);
    }

    erstelle_eingabe_text () {
        var text = "";
        if (this.knoten_ids) {
            this.knoten_ids.forEach(element => {
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

    erstelle_pac_ids_aus_eingabe (eingabe) {
        this.pac_ids = this.finde_id (eingabe, PAC_REGEXP);
    }

    erstelle_seq_ids_aus_eingabe (eingabe) {
        this.seq_ids = this.finde_id (eingabe, SEQ_REGEXP);
    }

    erstelle_knoten_ids_aus_eingabe (eingabe) {
        this.knoten_ids = this.finde_id (eingabe, KNOTEN_REGEXP);
        return this.knoten_ids;
    }


    erstelle_verbindungs_ids_aus_eingabe (eingabe) {
        this.verbindung_ids = this.finde_id (eingabe, VERBINDUNG_REGEXP);
        return this.verbindung_ids;
    }

    finde_id (eingabe, regEx) {
        var zeilen = this.teile_in_zeilen (eingabe);
        var idListe = [];
        for (let element of zeilen) {
            if (regEx.test (element)) {idListe.push (element)};
        }
        return idListe;
    }

    teile_in_zeilen (eingabe) {
        var zeilen = eingabe.split ("\n");
        return zeilen;
    }


}

