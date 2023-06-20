<?php
namespace App\Controllers;

class Maincontroller extends Controller {
    public function index() {
        $this->render("home");
    }
}