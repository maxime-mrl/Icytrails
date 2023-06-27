<?php
namespace App\Models;

class CommentsModel extends Model {

    protected $id;
    protected $for_level;
    protected $posted_by;
    protected $date;
    protected $comment;
    

    public function __construct() {
        $this->table = "comments";
    }

    /**
     * Find comments by levels and add username
     * @param string $id level id
     */
    public function findForLevelAndAddUsers(string $id) {
        return $this->customQuery("SELECT * FROM {$this->table} INNER JOIN users WHERE comments.posted_by = users.id AND for_level = ? ORDER BY date DESC", [$id])->fetchAll();
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

    public function getDate() {
        return $this->date;
    }

    public function setDate($date) {
        $this->date = $date;
        return $this;
    }

    public function getComment() {
        return $this->comment;
    }

    public function setComment($comment) {
        $this->comment = $comment;
        return $this;
    }
}