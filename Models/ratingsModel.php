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

    /**
     * Get the value of id
     */ 
    public function getId() {
        return $this->id;
    }

    /**
     * Set the value of id
     * @return  self
     */ 
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of for_level
     */ 
    public function getFor_level() {
        return $this->for_level;
    }

    /**
     * Set the value of for_level
     * @return  self
     */ 
    public function setFor_level($for_level) {
        $this->for_level = $for_level;
        return $this;
    }

    /**
     * Get the value of posted_by
     */ 
    public function getPosted_by() {
        return $this->posted_by;
    }

    /**
     * Set the value of posted_by
     * @return  self
     */ 
    public function setPosted_by($posted_by) {
        $this->posted_by = $posted_by;
        return $this;
    }

    /**
     * Get the value of difficulty
     */ 
    public function getDifficulty() {
        return $this->difficulty;
    }

    /**
     * Set the value of difficulty
     * @return  self
     */ 
    public function setDifficulty($difficulty) {
        $this->difficulty = $difficulty;
        return $this;
    }
}