<?php
namespace App\Models;

class UsersModel extends Model {
    protected $id;
    protected $username;
    protected $mail;
    protected $password;

    public function __construct() {
        $this->table = "users";
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

    public function getUsername() {
        return $this->username;
    }

    public function setUsername($username) {
        $this->username = $username;
        return $this;
    }

    public function getMail() {
        return $this->mail;
    }

    public function setMail($mail) {
        $this->mail = $mail;
        return $this;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setPassword($password) {
        $this->password = $password;
        return $this;
    }
}