<?php
namespace App\Controllers;
use App\Core\Tools;

abstract class controller {
    /**
     * Render a pages
     * @param string $file path from views to the file
     * @param array $data optional data used by the views
     */
    protected function render($file, $data = []) {
        extract($data);
        // user variable so if I change the session structure i just change here
        if (isset($_SESSION["user"])) {
            $logged = true;
            $user = $_SESSION["user"];
        } else {
            $logged = false;
        }
        // give referer to the page
        $referer = Tools::getReferer();
        // add every part of the view
        include_once ROOT . "/views/components/header.php"; // header
        include_once ROOT . "/views/" . $file . '.php'; // view itslef
        include_once ROOT . "/views/components/end.php"; // closing part of html (script and tag closing)
        // reset messages notifications
        unset($_SESSION["messages"]);
        unset($_SESSION["open"]);
    }
}