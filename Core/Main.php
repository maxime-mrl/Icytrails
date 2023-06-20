<?php
namespace App\Core;
use App\Controllers\Maincontroller;

class Main {
    public function start() {
        $errors = new \App\Controllers\ErrorsController;
        session_start();
        // url cleanup
        $uri = $_SERVER["REQUEST_URI"];
        if (!empty($uri) && $uri[-1] == "/") { // remove eventual trailling /
            http_response_code(301);
            header("location: " . substr($uri, 0, -1));
            if ($uri != "/") die;
        }
        // handle params
        $params = explode('/', $_GET["p"]);
        if ($params[0] !== "") {
            // here we have something
            // get the controller name to instanciate
            // ex get blog we need BlogController.php
            $controller = "\\App\\Controllers\\" . ucfirst(array_shift($params)) . "Controller"; // array_shift remove the first element of array and return it
            if (!class_exists($controller)) $errors->notFound();
            $controller = new $controller;
            // if we have 2nd params it's a method else we use index method
            $action = (isset($params[0])) ? array_shift($params) : "index";
            // $action = "index";
            // check if method and controller exist else send 404 / home
            if (method_exists($controller, $action)) {
                // check if we have still params left and we give them to the method
                // (isset($params[0])) ? $controller->$action($params[0]) : $controller->$action(); // work too just call_user_func_array is fancy
                (isset($params[0])) ? call_user_func_array([$controller, $action], $params) : $controller->$action();
            } else $errors->notFound();
        } else { // no params -> home
            $controller = new Maincontroller();
            $controller->index();
        }
    }
}