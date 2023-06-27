<?php
namespace App\Controllers;

class ErrorsController extends Controller {
    public function index($error = null) { // server error handling
        http_response_code(500);
        echo "<h1>Uh, Oh somethings went wrong</h1>";
        if (isset($error)) {
            echo "<pre>";
            var_dump($error);
            echo "</pre>";
        }
        exit;
    }
    public function notFound() { // not found error handling
        http_response_code(404);
        $this->render("404");
        exit;
    }
}