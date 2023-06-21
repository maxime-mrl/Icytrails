<?php
namespace App\Controllers;
use App\Models\LevelsModel;
use App\Core\Tools;

class LevelsController extends Controller {
    /* ----------------------------- ROUTES FUNCTION ---------------------------- */
    public function index() { // find alls levels and render them as list
        $levelsModel = new LevelsModel();
        $levels = $levelsModel->findBy([
            "visibility" => 1
        ]);
        $this->render("levels/browser", $levels);
    }

    public function own() {
        $user = Tools::IsLogged();
        if ($user === false) {
            header("location: /users/login");
            die();
        }
        $levelsModel = new LevelsModel();
        $levels = $levelsModel->findBy([
            "created_by" => $user->id
        ]);
        $this->render("levels/browser", $levels);
    }

    
    public function play($id = null) { // render wanted level to play it
        if (!isset($id)) { // check that we have an id given
            http_response_code(404);
            header("location: /404");
            die();
        }
        $levelsModel = new LevelsModel();
        $level = $levelsModel->findById($id); // try to find level
        if (!isset($level->level)) { // check that we found the level
            http_response_code(404);
            header("location: /404");
            die();
        }
        $this->render("levels/game", ["level"=>$level->level]); // render game page w/ level
    }

    public function details($id = null) { // show details of a given level
        if (!isset($id)) { // check that we have an id given
            http_response_code(404);
            header("location: /404");
            die();
        }
        $levelsModel = new LevelsModel();
        $level = $levelsModel->findById($id); // try to find level
        if (!isset($level)) { // check that we found the level
            http_response_code(404);
            header("location: /404");
            die();
        }
        $this->render("levels/details", ["level"=>$level]); // render game page w/ level
    }

    public function delete($id = null) {
        if (!isset($id)) { // check that we have an id given
            http_response_code(404);
            header("location: /404");
            die();
        }
        $levelsModel = new LevelsModel();
        $level = $levelsModel->findById($id); // try to find level
        if (!isset($level)) { // check that we found the level
            http_response_code(404);
            header("location: /404");
            die();
        }
        $user = Tools::IsLogged();
        if ($user === false) {
            header("location: /users/login");
            die();
        }
        if ($user->id !== $level->created_by) {
            header("location: /users/login");
            die();
        }
        $levelsModel->deleteById($id);
        header("location: /");
    }

    public function editor($uuid = null) { // editors handling (get the level save it render page)
        if (!isset($uuid)) {
            http_response_code(301);
            header("location: /" . $_GET["p"] . "/new");
        }
        $user = Tools::IsLogged();
        if ($user === false) {
            header("location: /users/login");
            die();
        }
        $levelsModel = new LevelsModel();
        if (!empty($_POST)) {
            if (!Tools::isEntriesCorrect($_POST)) die ("incorect data entries");
            $level = json_decode($_POST["level"]);
            $title = strip_tags($_POST["name"]);
            $visibility = intval($_POST["visibility"]);
            /* -------------------------- check level integrity ------------------------- */
            if (!$this->isLevelCorrect($level)) die ("incorect data level");
            // compress level (can divide by up to 3 the total size of level compared to plain json)
            $compressedLevel = "{$level->spawn->x},{$level->spawn->y};{$level->end->x},{$level->end->y}b";
            foreach($level->bg as $bg) $compressedLevel .= "{$bg->x},{$bg->y},{$bg->t};";
            $compressedLevel .= "f";
            foreach($level->fg as $fg) $compressedLevel .= "{$fg->x},{$fg->y},{$fg->t};";
            
            /* ------------------------------ Others check ------------------------------ */
            if (!preg_match('/.{5,100}$/', $title)) die("incorect data title"); // title
            if (!is_int($visibility) || $visibility > 1) die("incorect data visible"); /// visiblity

            // defines where should we go after
            $last_elem = explode('/', $_GET["p"])[array_key_last(explode('/', $_GET["p"]))];
            if ($last_elem === "try") {
                $path = "/levels/play/";
            } else {
                $path = "/levels/editor/";
            }

            /* ------------------------------- UUID check ------------------------------- */
            if ($uuid == "new") { // new level
                $uuid = $this->setUuid();
                $levelsModel->setId($uuid)
                    ->setName($title)
                    ->setVisibility($visibility)
                    ->setCreated_by($user->id)
                    ->setLevel($compressedLevel)
                    ->create($levelsModel);
                header("location: " . $path . $uuid);
                die("ok");
            } else { //uuid exist
                $level = $levelsModel->findById($uuid);
                if (!$level) {
                    die("Incorect data");
                } else {
                    if ($level->created_by === $user->id) {
                        $levelsModel->hydrate($level);
                        $levelsModel
                            ->setName($title)
                            ->setVisibility($visibility)
                            ->setLevel($compressedLevel)
                            ->updateById($levelsModel, $level->id);
                        header("location: " . $path . $uuid);
                    }
                }
            }
        } else {
            if ($uuid != "new") {
                $level = $levelsModel->findById($uuid);
                if ($level) {
                    if ($level->created_by === $user->id) {
                        $this->render("/levels/editor", ["level" => $level]);
                    }
                }
            } else {
                $this->render("/levels/editor", ["level" => false]);
            }
        }
    }

    /* ----------------------------- UTILS FUNCTIONS ---------------------------- */
    private function setUuid() {
        $levelsModel = new LevelsModel();
        $uuid = substr(uniqid(), 0, 10);
        if (!$levelsModel->findById($uuid)) {
            return $uuid;
        }
        return $this->setUuid();
    }
    private function isLevelCorrect($level) {
        // get every possible blocks code
        $blocks = [];
        foreach (json_decode(file_get_contents(ROOT . "/public/asset/json/blocks.json"))->blocks as $block) $blocks[] = $block[1];
        // check if level data are correct
        if (!is_int($level->spawn->x) || !is_int($level->spawn->y) || !is_int($level->end->x) || !is_int($level->end->y)) return false; // spawn and end
        // foreground blocks
        foreach($level->fg as $fg) {
            if (!is_int($fg->x) || !is_int($fg->y) || !is_int($fg->t) || $fg->t > 100) return false;
            if (!Tools::IsinArray($blocks, $fg->t)) return false;
        }
        // background blocks
        foreach($level->bg as $bg) {
            if (!is_int($bg->x) || !is_int($bg->y) || !is_int($bg->t) || $bg->t > 100) return false;
            if (!Tools::IsinArray($blocks, $bg->t)) return false;
        }
        return true;
    }
}