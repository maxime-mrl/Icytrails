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

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
        return $this;
    }

    public function getVisibility() {
        return $this->visibility;
    }

    public function setVisibility($visibility) {
        $this->visibility = $visibility;
        return $this;
    }

    public function getCreated_by() {
        return $this->created_by;
    }

    public function setCreated_by($created_by) {
        $this->created_by = $created_by;
        return $this;
    }

    public function getCrated_at() {
        return $this->crated_at;
    }

    public function setCrated_at($crated_at) {
        $this->crated_at = $crated_at;
        return $this;
    }

    public function getLevel() {
        return $this->level;
    }

    public function setLevel($level) {
        $this->level = $level;
        return $this;
    }
}