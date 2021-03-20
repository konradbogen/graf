
const DATEI_ENDUNG_REGEXP = /\.[a-zA-Z]*/;

const PHP_DIR_PREDECESSOR = "/mnt/sda/public_html/Graph/Content/"

const DIRECTORY = "https://graph.heptagon.network/Content/"

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

    save_storagefile_text (name, text) {
        var data = new FormData();
        data.append("name" , name);
        data.append("text" , text);
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");


        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log ("SUCESS REQUEST")
                console.log (xhr.responseText);
            }
        }
        xhr.open( 'post', './Upload.php', true );
        xhr.send(data);


    }
 
    get_storagefile_text (name, callback) {
        var jsonFile = new XMLHttpRequest();
        jsonFile.open("GET", "./Stored/" + name + ".txt", true);
        jsonFile.onreadystatechange = function  () {
            if (jsonFile.readyState == 4 && jsonFile.status == 200) {
                var text = jsonFile.responseText;
                var text = text.replace(/\r/g, "");
                callback (text);
                return text;
            }
        }.bind (this);
        jsonFile.send();
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
