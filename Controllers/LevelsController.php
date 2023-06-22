<?php
namespace App\Controllers;
use App\Models\CommentsModel;
use App\Models\LevelsModel;
use App\Core\Tools;
use App\Models\RatingsModel;

class LevelsController extends Controller {
    /* ----------------------------- ROUTES FUNCTION ---------------------------- */
    public function index() { // find alls levels and render them as list
        $levelsModel = new LevelsModel();
        $levels = $levelsModel->findBy([
            "visibility" => 1
        ]);
        $levels = $this->addRatingToLevels($levels);
        $this->render("levels/browser", $levels);
    }

    public function own() { // render just like index except only w/ our level regardless of visibility
        $user = Tools::IsLogged();
        $levelsModel = new LevelsModel();
        $levels = $levelsModel->findBy([
            "created_by" => $user->id
        ]);
        $levels = $this->addRatingToLevels($levels);
        $this->render("levels/browser", $levels);
    }

    public function details($uuid = null) { // show details of a given level
        // check that we have level
        $levelsModel = new LevelsModel();
        $level = $this->isLevelExist($uuid, $levelsModel);
        $level = $this->addRatingToLevels([ $level ])[0];
        $this->render("levels/details", ["level"=>$level]); // render game page w/ level
    }
    
    public function play($uuid = null) { // render wanted level to play it
        // check that we have level
        $levelsModel = new LevelsModel();
        $level = $this->isLevelExist($uuid, $levelsModel);
        $this->render("levels/game", ["level"=>$level->level]); // render game page w/ level
    }

    public function delete($uuid = null) {
        // check that we have level
        $levelsModel = new LevelsModel();
        $level = $this->isLevelExist($uuid, $levelsModel);
        // check that user is logged
        $user = Tools::IsLogged();
        if ($user->id !== $level->created_by) {
            Tools::redirectResponse("/", 200, [
                ['type' => "error", "text" => "You don't have the permission to delete this level"]
            ]);
        }
        $levelsModel->deleteById($uuid);
        Tools::redirectResponse("/levels/own", 200, [
            ['type' => "success", "text" => "Level successfully deleted!"]
        ]);
    }

    public function editor($uuid = null) { // editors handling (get the level save it render page)
        // check that user is logged
        $user = Tools::IsLogged();
        if (!isset($uuid)) { // if no uuid assume that we want a new level
            Tools::redirectResponse("/levels/editor/new", 200, [
                ['type' => "success", "text" => "Creating new level, will be effective when you'll save"]
            ]);
        }
        $levelsModel = new LevelsModel();
        if (!empty($_POST)) {
            Tools::checkEntriesValidity($_POST, "/level/editor/$uuid");
            $level = json_decode($_POST["level"]);
            $title = strip_tags($_POST["name"]);
            $visibility = intval($_POST["visibility"]);
            /* -------------------------- check level integrity ------------------------- */
            if (!$this->isLevelCorrect($level)) {
                Tools::redirectResponse("/level/editor/$uuid", 200, [
                    ['type' => "error", "text" => "Incorrect data, please try again"]
                ]);
            }
            // compress level (can divide by up to 3 the total size of level compared to plain json)
            $compressedLevel = "{$level->spawn->x},{$level->spawn->y};{$level->end->x},{$level->end->y}b";
            foreach($level->bg as $bg) $compressedLevel .= "{$bg->x},{$bg->y},{$bg->t};";
            $compressedLevel .= "f";
            foreach($level->fg as $fg) $compressedLevel .= "{$fg->x},{$fg->y},{$fg->t};";
            
            /* ------------------------------ Others check ------------------------------ */
            if (!preg_match('/.{5,100}$/', $title)) { // title
                Tools::redirectResponse("/level/editor/$uuid", 200, [
                    ['type' => "error", "text" => "Please enter a valid title"]
                ]);
            } // title
            if (!is_int($visibility) || $visibility > 1) { // visibility
                Tools::redirectResponse("/level/editor/$uuid", 200, [
                    ['type' => "error", "text" => "Please select a valid visibility"]
                ]);
            }

            // defines where should we go after
            $last_elem = explode('/', $_GET["p"])[array_key_last(explode('/', $_GET["p"]))];
            $path = $last_elem === "try" ? "/levels/play/" : "/levels/editor/";

            /* ------------------------------- UUID check ------------------------------- */
            if ($uuid == "new") { // new level
                $uuid = $this->setUuid();
                $levelsModel->setId($uuid)
                    ->setName($title)
                    ->setVisibility($visibility)
                    ->setCreated_by($user->id)
                    ->setLevel($compressedLevel)
                    ->create($levelsModel);
                Tools::redirectResponse($path . $uuid, 200, [
                    ['type' => "success", "text" => "Level created successfuly!"]
                ]);
            }
            // uuid exist
            $level = $this->isLevelExist($uuid, $levelsModel);
            if ($level->created_by !== $user->id) {
                Tools::redirectResponse("/", 200, [
                    ['type' => "error", "text" => "You don't have the permission to delete this level"]
                ]);
            }
            $levelsModel->hydrate($level);
            $levelsModel
                ->setName($title)
                ->setVisibility($visibility)
                ->setLevel($compressedLevel)
                ->updateById($levelsModel, $level->id);
            Tools::redirectResponse($path . $uuid, 200, [
                ['type' => "success", "text" => "Level updated successfuly!"]
            ]);
        } else {
            $level = false;
            if ($uuid != "new") {
                $level = $this->isLevelExist($uuid, $levelsModel);
                if ($level->created_by !== $user->id) {
                    Tools::redirectResponse("/users/login", 200, [
                        ['type' => "error", "text" => "Please log in before accessing this page"]
                    ]);
                }
            }
            $this->render("/levels/editor", ["level" => $level]);
        }
    }

    public function setrating($uuid = null) {
        $levelsModel = new LevelsModel();
        $levelId = $this->isLevelExist($uuid, $levelsModel)->id;
        $userId = Tools::IsLogged()->id;
        if (!isset($_POST["difficulty"])) {
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"error", "text"=>"Please provide a valid input for your rating"]
            ]);
        }
        $difficulty = intval($_POST["difficulty"]);
        if ($difficulty < 0 || $difficulty > 100) {
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"error", "text"=>"Please provide a valid input for your rating"]
            ]);
        }
        $ratingsModel = new RatingsModel();
        $existingRating = $ratingsModel->findBy([
            "posted_by" => $userId,
            "for_level" => $levelId
        ]);
        if (isset($existingRating[0])) {
            $existingRating = $ratingsModel->hydrate($existingRating[0]);
            $ratingsModel->setDifficulty($difficulty);
            $ratingsModel->updateById($ratingsModel, $ratingsModel->getId());
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"success", "text"=>"Personal rating successfully updated!"]
            ]);
        } else {
            $ratingsModel->setFor_level($levelId)
                ->setPosted_by($userId)
                ->setDifficulty($difficulty);
            $ratingsModel->create($ratingsModel);
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"success", "text"=>"Personal rating successfully posted!"]
            ]);
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

    private function isLevelExist($id, $levelsModel) {
        if (!isset($id)) { // check that we have an id given
            Tools::redirectResponse("/levels", 200, [
                ['type' => "error", "text" => "You need a valid level id! $id"]
            ]);
        }
        $level = $levelsModel->findById($id); // try to find level
        if (!isset($level->level)) { // check that we found the level
            Tools::redirectResponse("/404", 404);
        }
        return $level;
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

    private function addRatingToLevels($levels) {
        $ratingsModel = new RatingsModel();
        $commentsModel = new CommentsModel();
        $user = Tools::IsLogged(false);
        foreach ($levels as $level) {
            $level->ratings = $ratingsModel->findBy([
                "for_level" => $level->id
            ]);
            $level->comments = $commentsModel->findBy([
                "for_level" => $level->id
            ]);
            if (count($level->ratings) < 1) {
                $level->ratingAverage = 50;
            } else {
                $level->ratingAverage = 0;
                foreach ($level->ratings as $rating) {
                    $level->ratingAverage += intval($rating->difficulty);
                }
                $level->ratingAverage = $level->ratingAverage / count($level->ratings);
            }

            if ($user !== false) {
                $selfRating = $ratingsModel->findBy([
                    "posted_by" => $user->id,
                    "for_level" => $level->id
                ]);
                $level->selfRating = isset($selfRating[0]) ? $selfRating[0]->difficulty : 50;
            }
        }
        return $levels;
    }
}