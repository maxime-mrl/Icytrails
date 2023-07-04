<?php
namespace App\Controllers;
use App\Models\CommentsModel;
use App\Models\LevelsModel;
use App\Core\Tools;
use App\Models\RatingsModel;    

class LevelsController extends Controller {
    /* ----------------------------- ROUTES FUNCTION ---------------------------- */
    public function index() { // find alls visible levels and render them as list
        $levelsModel = new LevelsModel();
        $levels = $levelsModel->findBy([ "visibility" => 1 ]);
        $levels = $this->addRatingToLevels($levels); // add comments and rating to level object

        $this->render("levels/browser", ["levels"=>$levels]);
    }

    public function own() { // find alls owned levels and render them as list
        $user = Tools::IsLogged();
        $levelsModel = new LevelsModel();
        $levels = $levelsModel->findBy([ "created_by" => $user->id ]);
        $levels = $this->addRatingToLevels($levels); // add comments and rating to level object

        $this->render("levels/browser", ["levels"=>$levels]);
    }

    public function details($uuid = null) { // show details of a given level
        $levelsModel = new LevelsModel();
        $level = $this->isLevelExist($uuid, $levelsModel); // check that level exist and get it
        $level = $this->addRatingToLevels([ $level ])[0]; // add comments and rating to level object

        $this->render("levels/details", ["level"=>$level]);
    }
    
    public function play($uuid = null) { // render wanted level to play it
        $levelsModel = new LevelsModel();
        $level = $this->isLevelExist($uuid, $levelsModel); // check that level exist and get it

        $this->render("levels/game", ["level"=>$level->level]); // render game page w/ level
    }

    public function delete($uuid = null) { // delete level (from level editor)
        $levelsModel = new LevelsModel();
        $level = $this->isLevelExist($uuid, $levelsModel); // check that level exist and get it
        $user = Tools::IsLogged(); // check that user is logged
        // check that user own the level otherwise no right to delete it
        if ($user->id !== $level->created_by) {
            Tools::redirectResponse("/", 200, [
                ['type' => "error", "text" => "You don't have the permission to delete this level"]
            ]);
        }
        // All ok -> delete and redirect to show success
        $levelsModel->deleteById($uuid);
        Tools::redirectResponse("/levels/own", 200, [
            ['type' => "success", "text" => "Level successfully deleted!"]
        ]);
    }

    public function editor($uuid = null) { // editors handling (get the level save it render page)
        $user = Tools::IsLogged(); // check that user is logged
        $levelsModel = new LevelsModel();
        
        if (!isset($uuid)) { // if no uuid we want a new level so redirect to new uuid
            Tools::redirectResponse("/levels/editor/new", 200, [
                ['type' => "success", "text" => "Creating new level, will be effective when you'll save"]
            ]);
        }

        if (!empty($_POST)) {
            /* ------------------------------- basic check ------------------------------ */
            Tools::checkEntriesValidity($_POST, "/levels/editor/$uuid");
            $level = json_decode($_POST["level"]);
            $title = strip_tags($_POST["name"]);
            $visibility = intval($_POST["visibility"]);
            /* -------------------------- check level integrity ------------------------- */
            if (!$this->isLevelCorrect($level)) {
                Tools::redirectResponse("/levels/editor/$uuid", 200, [
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
                Tools::redirectResponse("/levels/editor/new", 200, [
                    ['type' => "error", "text" => "Please enter a valid title"]
                ]);
            } // title
            if (!is_int($visibility) || $visibility > 1 || $visibility < 0) { // visibility
                Tools::redirectResponse("/levels/editor/$uuid", 200, [
                    ['type' => "error", "text" => "Please select a valid visibility"]
                ]);
            }

            // defines where should we go after
            $last_elem = explode('/', $_GET["p"])[array_key_last(explode('/', $_GET["p"]))]; // url should look something like this /levels/editor/try or /levels/editor/save and we get try or save
            $path = $last_elem === "try" ? "/levels/play/" : "/levels/editor/"; // define the path acoording to above

            /* ------------------------------- UUID check ------------------------------- */
            if ($uuid == "new") {
                // new level
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
                    ['type' => "error", "text" => "You don't have the permission to edit this level"]
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
        }
        $level = false; // if no level we set to false so js understand
        if ($uuid != "new") { // if uuid is set find level check user has perms and render it
            $level = $this->isLevelExist($uuid, $levelsModel);
            if ($level->created_by !== $user->id) {
                Tools::redirectResponse(Tools::getReferer(), 200, [
                    ['type' => "error", "text" => "You don't have the right to edit this level"]
                ]);
            }
        }
        $this->render("/levels/editor", ["level" => $level]);
    }

    public function setrating($uuid = null) { // set rating for a level
        /* ------------------------------- basic check ------------------------------ */
        if (empty($_POST) || empty($uuid)) {
            Tools::redirectResponse(Tools::getReferer(), 200, [
                ["type"=>"error", "text"=>"Invalid request"]
            ]);
        }
        Tools::checkEntriesValidity($_POST, "/levels/details/$uuid");
        $levelsModel = new LevelsModel();
        $levelId = $this->isLevelExist($uuid, $levelsModel)->id; // check that level exist and get the id (even if it's found by it's id w/ that we are certaain that the levelID is valid)
        $userId = Tools::IsLogged()->id; // get user id
        if (!isset($_POST["difficulty"])) { // check that rating is present
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"error", "text"=>"Please provide a valid input for your rating"]
            ]);
        }
        $difficulty = intval($_POST["difficulty"]);
        if ($difficulty < 0 || $difficulty > 100) { // check the rating validity
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"error", "text"=>"Please provide a valid input for your rating"]
            ]);
        }
        /* ----------------------------- data validated ----------------------------- */
        $ratingsModel = new RatingsModel();
        // check if user arleady set a rating
        $existingRating = $ratingsModel->findBy([
            "posted_by" => $userId,
            "for_level" => $levelId
        ]);
        if (isset($existingRating[0])) { // rating exist -> edit
            $ratingsModel->hydrate($existingRating[0]);
            $ratingsModel->setDifficulty($difficulty);
            $ratingsModel->updateById($ratingsModel, $ratingsModel->getId());
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"success", "text"=>"Personal rating successfully updated!"]
            ]);
        }
        // rating dosen't exist -> create
        $ratingsModel->setFor_level($levelId)
            ->setPosted_by($userId)
            ->setDifficulty($difficulty);
        $ratingsModel->create($ratingsModel);
        Tools::redirectResponse("/levels/details/$levelId", 200, [
            ["type"=>"success", "text"=>"Personal rating successfully posted!"]
        ]);
    }

    public function postcomment($uuid = null) { // post a comment
        /* ------------------------------- basic check ------------------------------ */
        if (empty($_POST) || empty($uuid)) {
            Tools::redirectResponse(Tools::getReferer(), 200, [
                ["type"=>"error", "text"=>"Invalid request"]
            ]);
        }
        Tools::checkEntriesValidity($_POST, "/levels/details/$uuid");
        $levelsModel = new LevelsModel();
        $levelId = $this->isLevelExist($uuid, $levelsModel)->id; // check that level exist and get the id (even if it's found by it's id w/ that we are certaain that the levelID is valid)
        $userId = Tools::IsLogged()->id; // get user id
        /* ------------------------------ comment check ----------------------------- */
        if (!isset($_POST["comment"]) || !preg_match("/^.{5,300}$/", $_POST["comment"])) {
            Tools::redirectResponse("/levels/details/$levelId", 200, [
                ["type"=>"error", "text"=>"Please provide a valid comment"]
            ]);
        }
        /* ----------------------------- data validated ----------------------------- */
        $comment = strip_tags($_POST["comment"]);
        $commentsModel = new CommentsModel();
        $commentsModel->setFor_level($levelId)
            ->setPosted_by($userId)
            ->setComment($comment);
        $commentsModel->create($commentsModel);
        Tools::redirectResponse("/levels/details/$levelId", 200, [
            ["type"=>"success", "text"=>"Your comment is successfully posted!"]
        ]);
    }

    /* ----------------------------- UTILS FUNCTIONS ---------------------------- */
    /**
     * Set uuid for level
     * @return string uuid
     */
    private function setUuid() {
        $levelsModel = new LevelsModel();
        $uuid = substr(uniqid(), 0, 10);
        if (!$levelsModel->findById($uuid)) {
            return $uuid;
        }
        return $this->setUuid();
    }

    /**
     * Check if level exist (return level only if exist, else redirect)
     * @param string $id
     * @param mixed $levelsModel
     * @return object level
     */
    private function isLevelExist($id, $levelsModel) {
        if (!isset($id)) { // check that we have an id given
            Tools::redirectResponse("/levels", 200, [
                ['type' => "error", "text" => "You need a valid level id! $id"]
            ]);
        }
        $level = $levelsModel->findById($id); // try to find level
        if (!isset($level->id)) { // check that we found the level
            Tools::redirectResponse("/404", 404);
        }
        return $level;
    }

    /**
     * Check provided level object validity by checking if we have spawn end, all block code exists etc
     * @param object $level
     * @return bool
     */
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

    /**
     * Add ratings and comment to levels objects
     * @param array $levels
     * @return array levels
     */
    private function addRatingToLevels($levels) {
        $ratingsModel = new RatingsModel();
        $commentsModel = new CommentsModel();
        
        foreach ($levels as $level) {
            // add comments
            $level->comments = $commentsModel->findForLevelAndAddUsers($level->id); // find comment and add username
            // add rating
            $ratings = $ratingsModel->findBy([
                "for_level" => $level->id
            ]);
            if (count($ratings) < 1) {
                $level->rating = 50;
            } else {
                $level->rating = 0;
                foreach ($ratings as $rating) {
                    $level->rating += intval($rating->difficulty);
                }
                $level->rating = $level->rating / count($ratings);
            }
            // if user logged get potential user rating
            $user = Tools::IsLogged(false); // false to not redirect and stop if no user (since user log is optional at this point)
            if ($user !== false) {
                $selfRating = $ratingsModel->findBy([
                    "posted_by" => $user->id,
                    "for_level" => $level->id
                ]);
                $level->selfRating = isset($selfRating[0]) ? $selfRating[0]->difficulty : 50; // if no ratings set the default value of the form to 50%
            }
        }
        return $levels;
    }
}