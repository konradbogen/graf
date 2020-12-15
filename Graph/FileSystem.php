
<?php

function verzeichnisAuslesen ($path) {
    if ($handle = opendir($path)) {

        //readdir kann auch andere Werte zurückgeben, die als false gewertet werden, aber nicht false sind, deshalb schreiben wir !== false
        while (false !== ($files[] = readdir($handle))) {
        }
        $filesJSON = json_encode($files); //JSON ist das Datenformat zur Kommunikation mit Javascript
        closedir($handle);
        return $filesJSON;
    }
}
//testg
    $main = "/public_html/Graph/Content"; //die Main URL sollte man irgendwann zentral in einer Datenbank hinterlegen
    echo verzeichnisAuslesen ($main);

?>
