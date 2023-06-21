<?php
namespace App\Controllers;

abstract class controller {
    protected function render($file, $data = []) {
        extract($data);
        include_once ROOT . "/Views/components/header.php";
        include_once ROOT . "/Views/" . $file . '.php';
        include_once ROOT . "/Views/components/end.php";
        // reset messages
        $_SESSION["messages"] = null;
    }
}