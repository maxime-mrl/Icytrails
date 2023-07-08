<?php
define('ROOT', dirname(__DIR__)); // defines root path
// autoloader
use App\Autoloader;
require_once ROOT.'/Autoloader.php';
Autoloader::register();
// launch app
use App\Core\Main;
$app = new Main();
$app->start();
