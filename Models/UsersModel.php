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
     * Get the value of username
     */ 
    public function getUsername() {
        return $this->username;
    }

    /**
     * Set the value of username
     * @return  self
     */ 
    public function setUsername($username) {
        $this->username = $username;
        return $this;
    }

    /**
     * Get the value of Email
     */ 
    public function getMail() {
        return $this->mail;
    }

    /**
     * Set the value of Email
     * @return  self
     */ 
    public function setMail($mail) {
        $this->mail = $mail;
        return $this;
    }

    /**
     * Get the value of password
     */ 
    public function getPassword() {
        return $this->password;
    }

    /**
     * Set the value of password
     * @return  self
     */ 
    public function setPassword($password) {
        $this->password = $password;
        return $this;
    }
}