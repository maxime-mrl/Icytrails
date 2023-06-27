<?php
namespace App\Controllers;

class Maincontroller extends Controller {
    public function index() { // render home page
        $this->render("home");
    }
}