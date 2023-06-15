<?php
namespace App\Core;

use PDO;
use PDOException;

class Db extends PDO {
    // classe instance
    private static $instance;

    // DB PARAMS
    private const DBHOST = "127.0.0.1";
    private const DBUSER = "root";
    private const DBPASS = "";
    private const DBNAME = "icytrails";

    private function __construct() {
        // connexion request
        $dsn = "mysql:dbname=" . self::DBNAME . ";host=" . self::DBHOST;
        try {
            parent::__construct($dsn, self::DBUSER, self::DBPASS);
            $this->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
            $this->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) { die($e->getMessage()); }
    }

    public static function getInstance() { // allow to have only one Db classe instance so one connection
        if (self::$instance === null) self::$instance = new self();
        return self::$instance;
    }
}