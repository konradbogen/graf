
const DATEI_ENDUNG_REGEXP = /\.[a-zA-Z]*/;


const WAV_REGEXP = /.*.wav/;
const MP3_REGEXP = /.*.mp3/;


const VERZEICHNIS = "https://www.hepta.ga/Graph/Content/"

class FileSystem {
    constructor () {
        this.node_ids = [];
        this.urls = [];
    }

    static get KNOTEN_REGEXP () {
        return KNOTEN_REGEXP;
    }
 
    static get VERBINDUNG_REGEXP () {
        return VERBINDUNG_REGEXP;
    }

    lese_verzeichnis_aus () {
        this.urls = [];
        var array = [];
        array = this.request_php_verzeichnis (array);
        console.log ("VERZEICHNIS");
        console.log (array);
        array.forEach(element => {
            if (element != false) { //JSON gibt manchmal ein false mit
                var dateiname = new String (element);
                if (dateiname != "." && dateiname != null && dateiname != "..") {
                    this.fuge_datei_hinzu(dateiname);
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

    fuge_datei_hinzu (dateiname) {
        var id = this.erstelle_id_aus_dateiname(dateiname);
        this.node_ids.push(id);
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

}

//94
