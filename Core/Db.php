<?php
namespace App\Core;

use PDO;
use PDOException;

class Db extends PDO {
    private static $instance; // class instance so the class only created one time

    // DB creditentials [UPDATE THAT TO MATCH YOUR DB]
    private const DBHOST = "127.0.0.1";
    private const DBUSER = "root";
    private const DBPASS = "";
    private const DBNAME = "icytrails";

    private function __construct() {
        $dsn = "mysql:dbname=" . self::DBNAME . ";host=" . self::DBHOST;
        
        try {
            // try to connect to database
            parent::__construct($dsn, self::DBUSER, self::DBPASS);
            // transfer setup
            $this->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
            $this->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            // drop a basic 500 error and vardump the log
            $errors = new \App\Controllers\ErrorsController;
            $errors->index($e->getMessage());
        }
    }

    public static function getInstance() { // either create a new class or return the existing instance
        if (self::$instance === null) self::$instance = new self();
        return self::$instance;
    }
}