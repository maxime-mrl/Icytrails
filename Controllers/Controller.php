<?php
namespace App\Controllers;

abstract class controller {
    protected function render($file, $data = []) {
        // we extract the data
        extract($data);
        include_once ROOT . "/Views/components/header.php";
        include_once ROOT . "/Views/" . $file . '.php';
        include_once ROOT . "/Views/components/end.php";
        // we  could create here a 500 error for if the file dosen't exist
    }
}