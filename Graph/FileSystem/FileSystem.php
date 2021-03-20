
<?php

function getDirContents($dir, &$results = array()) {
    $files = scandir($dir);
    $results[] = realpath($main);
    foreach ($files as $key => $value) {
        $path = realpath($dir . DIRECTORY_SEPARATOR . $value);
        if (!is_dir($path)) {
            $results[] = $path;
        } else if ($value != "." && $value != "..") {
            getDirContents($path, $results);
            $results[] = $path;
        }
    }
    $resultsJSON = json_encode($results);
    return $resultsJSON;
}
/* 

function verzeichnisAuslesen ($path, $totalFilesJSON) {
    if ($handle = opendir($path)){
        //readdir kann auch andere Werte zurückgeben, die als false gewertet werden, aber nicht false sind, deshalb schreiben wir !== false
        while (false !== ($files = readdir($handle))) {
        }
        $filesJSON = json_encode($files); //JSON ist das Datenformat zur Kommunikation mit Javascript
        for 
        closedir($handle);
        return $filesJSON;
    }
} */
    $main = "./Content/"; //die Main URL sollte man irgendwann zentral in einer Datenbank hinterlegen
    echo getDirContents ($main, $filesJSON);

?>
