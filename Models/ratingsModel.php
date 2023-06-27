<?php
namespace App\Models;

class RatingsModel extends Model {

    protected $id;
    protected $for_level;
    protected $posted_by;
    protected $difficulty;
    

    public function __construct() {
        $this->table = "rating";
    }

   /* -------------------------------------------------------------------------- */
   /*                             GETTERS AND SETTER                             */
   /* -------------------------------------------------------------------------- */
    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    public function getFor_level() {
        return $this->for_level;
    }

    public function setFor_level($for_level) {
        $this->for_level = $for_level;
        return $this;
    }

    public function getPosted_by() {
        return $this->posted_by;
    }

    public function setPosted_by($posted_by) {
        $this->posted_by = $posted_by;
        return $this;
    }

    public function getDifficulty() {
        return $this->difficulty;
    }

    public function setDifficulty($difficulty) {
        $this->difficulty = $difficulty;
        return $this;
    }
}