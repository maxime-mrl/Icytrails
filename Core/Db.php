<?php
namespace App\Core;

use PDO;
use PDOException;

class Db extends PDO {
    // instance unique de la classe
    private static $instance;

    // constante de connexion a la BDD
    private const DBHOST = "127.0.0.1";
    private const DBUSER = "root";
    private const DBPASS = "";
    private const DBNAME = "icytrails";

    private function __construct() {
        // DSN de connexion
        $dsn = "mysql:dbname=" . self::DBNAME . ";host=" . self::DBHOST; // self un peu comme this mais this = instance de la classe self la classe generale

        
        try {
            // on appelle le constructeur de la classe PDO
            parent::__construct($dsn, self::DBUSER, self::DBPASS);
            // param comment on transmet et reçoit les infos
            $this->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
            $this->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // comme ça de base mais on sait jamais
        } catch (PDOException $e) {
            die($e->getMessage()); // pas propre mais goodenought pour l'instant
        }
    }

    public static function getInstance() { // une instance pour se connecter une seule fois
        // au lieux d'utiliser new Db() on fait Db::getInstance pour creer la db que si elle n'existe pas - et elle se créer elle meme
        if (self::$instance === null) self::$instance = new self();
        return self::$instance;
    }
}