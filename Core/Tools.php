<?php
namespace App\Core;
use App\Models\UsersModel;

class Tools {
    public static function checkEntriesValidity($post, $url) {
        foreach($post as $field => $value) { // check that nothing is empty or not plain text
            if (!isset($value)) {
                Tools::redirectResponse($url, 200, [
                    ['type' => "error", "text" => "Please fill the $field"]
                ]);
            }
            if (strip_tags($value) != $value) {
                Tools::redirectResponse($url, 200, [
                    ['type' => "error", "text" => "You should only fill plain text"]
                ]);
            }
        }
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
        Tools::redirectResponse("/users/login", 200, [
            ['type' => "error", "text" => "Please log in before accessing this page"]
        ]);
    }
    public static function redirectResponse($path, $code=200, $messages = null, $open = null) {
        $_SESSION["messages"] = $messages;
        $_SESSION["open"] = $open;
        http_response_code($code);
        header("location: " . $path);
        die();
    }
}