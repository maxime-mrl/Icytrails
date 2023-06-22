<?php
namespace App\Models;

class LevelsModel extends Model {

    protected $id;
    protected $name;
    protected $visibility;
    protected $created_by;
    protected $crated_at;
    protected $level;
    

    public function __construct() {
        $this->table = "levels";
    }

   

    /**
     * Get the value of uuid
     */ 
    public function getId() {
        return $this->id;
    }

    /**
     * Set the value of uuid
     * @return  self
     */ 
    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of name
     */ 
    public function getName() {
        return $this->name;
    }

    /**
     * Set the value of name
     * @return  self
     */ 
    public function setName($name) {
        $this->name = $name;
        return $this;
    }

    /**
     * Get the value of visibility
     */ 
    public function getVisibility() {
        return $this->visibility;
    }

    /**
     * Set the value of visibility
     * @return  self
     */ 
    public function setVisibility($visibility) {
        $this->visibility = $visibility;
        return $this;
    }

    /**
     * Get the value of created_by
     */ 
    public function getCreated_by() {
        return $this->created_by;
    }

    /**
     * Set the value of created_by
     * @return  self
     */ 
    public function setCreated_by($created_by) {
        $this->created_by = $created_by;
        return $this;
    }

    /**
     * Get the value of crated_at
     */ 
    public function getCrated_at() {
        return $this->crated_at;
    }

    /**
     * Set the value of crated_at
     * @return  self
     */ 
    public function setCrated_at($crated_at) {
        $this->crated_at = $crated_at;
        return $this;
    }

    /**
     * Get the value of level
     */ 
    public function getLevel() {
        return $this->level;
    }

    /**
     * Set the value of level
     * @return  self
     */ 
    public function setLevel($level) {
        $this->level = $level;
        return $this;
    }
}