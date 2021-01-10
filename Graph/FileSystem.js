
const DATEI_ENDUNG_REGEXP = /\.[a-zA-Z]*/;


const WAV_REGEXP = /.*.wav/;
const MP3_REGEXP = /.*.mp3/;

const PHP_DIR_PREDECESSOR = "/var/www/heptagon/public_html/Graph/Content/"

const DIRECTORY = "https://www.hepta.ga/Graph/Content/"

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

    read_directory () {
        this.urls = [];
        var array = [];
        array = this.request_php_verzeichnis (array);
        array.forEach(element => {
            if (element != false) { //JSON gibt manchmal ein false mit
                var php_string = new String (element);
                if (php_string != "." && php_string != null && php_string != "..") {
                    this.fuge_datei_hinzu(php_string);
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

    fuge_datei_hinzu (php_string) {
        var relative_file_path = this.create_relative_file_path (php_string);
        var node_id = this.create_node_id_from_rel_file_path (relative_file_path);
        if (node_id) {
            this.node_ids.push(node_id);
            this.urls.push(DIRECTORY + relative_file_path);
        }
    }

    create_node_id_from_rel_file_path (file_path) {
        var string_without_fileextension = file_path.substr (0, file_path.lastIndexOf (".")) || null;
        if (string_without_fileextension) {
            var string_without_slash = string_without_fileextension.replaceAll ("/", ".");
            var string_without_dash = string_without_slash.replaceAll ("-", "");
            return string_without_dash;
        }
        return null;
    }

    create_relative_file_path (php_string) {
        var stringOhneVerzeichnis = php_string.substr (PHP_DIR_PREDECESSOR.length);
        return stringOhneVerzeichnis;
    }

    erstelle_knoten_id_aus_url (urlString) {
        var dateinameString = this.create_relative_file_path (urlString);
        var id = this.erstelle_id_aus_dateiname (dateinameString);
        return id;
    }

    get_all_ids_entry_text () {
        var text = "";
        this.node_ids.forEach (id => {
            text = text + id +"\n"
        })
        return text;
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
