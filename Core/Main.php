<?php
namespace App\Core;
use App\Controllers\Maincontroller;

class Main {
    public function start() {
        $errors = new \App\Controllers\ErrorsController;
        session_start(); // start session
        $uri = $_SERVER["REQUEST_URI"];
        if (!empty($uri) && $uri[-1] == "/") { // remove eventual trailling /
            http_response_code(301);
            header("location: " . substr($uri, 0, -1));
            if ($uri != "/") die;
        }
        /* ------------------------------- HANDLE PATH ------------------------------ */
        $params = explode('/', $_GET["p"]);
        if ($params[0] !== "") {
            // set corresponding controller of url
            $controller = "\\App\\Controllers\\" . ucfirst(array_shift($params)) . "Controller";
            if (!class_exists($controller)) $errors->notFound(); // check if class exist
            $controller = new $controller;
            $action = (isset($params[0])) ? array_shift($params) : "index"; // if we have 2nd params it's a method else we use index method
            if (!method_exists($controller, $action)) $errors->notFound(); // check if method exist
            
            (isset($params[0])) ? call_user_func_array([$controller, $action], $params) : $controller->$action(); // if we still have param left and we pass it
        } else { // no params -> home
            $controller = new Maincontroller();
            $controller->index();
        }
    }
}