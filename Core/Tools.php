<?php
namespace App\Core;
use App\Models\UsersModel;

class Tools {
    public static function isEntriesCorrect($post) {
        foreach($post as $field => $value) { // check that nothing is empty or not plain text
            if (!isset($value) || strip_tags($value) != $value) {
                return false;
            }
        }
        return true;
    }
    public static function IsinArray($array, $filter) {
        foreach ($array as $item) if ($filter == $item) return true;
        return false;
    }
    public static function IsLogged() {
        if (isset($_SESSION["user"]) && isset($_SESSION["user"]["id"])) {
            $usersModel = new UsersModel();
            $user = $usersModel->findById($_SESSION["user"]["id"]);
            if (isset($user) && is_int($user->id)) {
                return $user;
            }
        }
        return false;
    }
}