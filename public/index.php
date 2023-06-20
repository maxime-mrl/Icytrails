<?php
define('ROOT', dirname(__DIR__)); // dirname donne la racine du projet
use App\Autoloader;
require_once ROOT.'/Autoloader.php';
Autoloader::register();

use App\Core\Main;

$app = new Main();
$app->start();
// echo "test";
