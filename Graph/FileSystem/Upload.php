<?php
    echo ("Request To Save File: ");
    $data = $_POST['text'];
    $fname = $_POST['name'] . ".txt"; 
    $fpath = "./Stored/" . $fname;

    echo (realpath ($fpath) . "\n");

    $file = fopen($fpath, 'w');//creates new file
    if (false === $file) {
        echo ('Unable to open' . "\n");
    }    
    $bytes = fwrite($file, $data);
    echo (" Wrote so many Bytes");
    echo ($bytes . "\n");
    fclose($file);

    if ($handle = opendir('./Stored/')) {
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                echo ($entry . "\n");
            }
        }
        closedir($handle);
    }
    
?>
