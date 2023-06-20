<?php
namespace App\Controllers;

class LevelsController extends Controller {
    public function index() {
        $this->render("levels/browser");
    }
    public function play() {
        $this->render("levels/game");
    }
    public function editor($level = null) {
        if (!isset($level)) {
            header("location: /" . $_GET["p"] . "/new");
        }
        if (isset($_SESSION["user"])) {
            $this->render("/levels/editor");
        } else {
            header("location: /users/login");
        }
    }
}