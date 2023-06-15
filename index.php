<?php
use App\Autoloader;
require_once "./Autoloader.php";
Autoloader::register();

use App\Models\LevelsModel;
$model = new LevelsModel();
echo "<pre>";
var_dump($model->insert([
    "uuid" => substr(uniqid(), 0, 10),
    "visibility" => 0,
    "created_by" => 1,
    "level" => "jjj"
]));
echo "</pre>";
// echo substr(uniqid(), 0, 10);