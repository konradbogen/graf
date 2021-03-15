<?php
    echo ("gogo ");
    $data = $_POST['text'];
    $fname = $_POST['name'] . ".txt"; 
    $fpath = "../Graph/Stored/" . $fname;

    echo ($path . "\n");

    $file = fopen($fpath, 'w');//creates new file
    if (false === $file) {
        echo ('Unable to open' . "\n");
    }    
    $bytes = fwrite($file, $data);
    echo (" Wrote so many bytes ");
    echo ($bytes . "\n");
    fclose($file);

    if ($handle = opendir('../Graph/Stored/')) {
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
                echo ($entry . "\n");
            }
        }
        closedir($handle);
    }
    
?>
