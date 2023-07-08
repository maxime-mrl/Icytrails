<?php
namespace App;

class Autoloader {
    static function register() {
        spl_autoload_register([
            __CLASS__,
            "autoload"
        ]);
    }

    static function autoload($class) {
        // on recup dans le $class les namespace
        // on enlève App\
        $class = str_replace(__NAMESPACE__ . "\\", "", $class);
        // on remplace les "\" par des "/" pour ecrire les chemins d'accès dans nos classes
        $class = str_replace("\\", "/", $class);
        // on ecrit le chemin d'accès pour le require
        $file = __DIR__ . "/" . $class . ".php";
        if (file_exists($file)) {
            require_once $file;
        } else {
            http_response_code(500);
            die("file not found, you can report this problem to the webmaster $file");
        }
    }
}