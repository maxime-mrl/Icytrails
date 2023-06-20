<?php
namespace App\Controllers;

class ErrorsController extends Controller {
    public function index() {
        http_response_code(500);
        echo "<h1>Uh, Oh somethings went wrong</h1>";
        die();
    }
    public function notFound() {
        http_response_code(404);
        $this->render("404");
        die();
    }
}