<?php
namespace App\Core;
use App\Models\UsersModel;

class Tools {
    /**
     * Check that every entries present in the $_POST are filled and do not contain html
     * @param array $post $_post object
     * @param string $url where to redirect if error
     */
    public static function checkEntriesValidity(array $post, string $url, $modal = null) {
        foreach($post as $field => $value) {
            if (!isset($value)) {
                Tools::redirectResponse($url, 200, [
                    ['type' => "error", "text" => "Please fill the $field"]
                ], $modal);
            }
            if (strip_tags($value) != $value) {
                Tools::redirectResponse($url, 200, [
                    ['type' => "error", "text" => "You should only fill plain text"]
                ], $modal);
            }
        }
    }

    /**
     * Check if something is in an array
     * @param array $array
     * @param mixed $filter
     */
    public static function IsinArray(array $array, mixed $filter) {
        foreach ($array as $item) if ($filter == $item) return true;
        return false;
    }

    /**
     * Check if user is logged and return it
     * @param bool $redirect default true redirect or return false when not logged 
     */
    public static function IsLogged(bool $redirect = true) {
        if (isset($_SESSION["user"]) && isset($_SESSION["user"]["id"])) {
            $usersModel = new UsersModel();
            $user = $usersModel->findById($_SESSION["user"]["id"]);
            if (isset($user) && is_int($user->id)) {
                return $user;
            }
        }
        if ($redirect === false) return false;
        Tools::redirectResponse("/users/login", 200, [
            ['type' => "error", "text" => "Please log in before accessing this page"]
        ]);
    }

    /**
     * Redirect to a specific url and stop code to stop anything after
     * @param string $path redirect url
     * @param int $code [OPTIONAL] response code used
     * @param mixed $message [OPTIONAL] message notifications displayed
     * @param mixed $open [OPTIONAL] default opened modals
     */
    public static function redirectResponse(string $path, int $code=200, mixed $messages = null, mixed $open = null) {
        foreach ($messages as $message) {
            $_SESSION["messages"][] = $message;
        }
        $_SESSION["open"] = $open;
        http_response_code($code);
        header("location: " . $path);
        exit;
    }

    /**
     * return refferer adress adressing the various problems of http refferer (can be undefined or can be the same url as the current page)
     * @return string correct enough http referer
     */
    public static function getReferer() {
        $referer = isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : '/'; // get the refferer if it exist
        // create the aactual full url
        $currentProtocol = isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on" ? "https://" : "http://"; // check if we are in http or https
        $currentUrl = $currentProtocol . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]; // full url

        if ($referer !== $currentUrl) { // check if refferer and current url are the same or not
            return $referer; // refer is correct
        }
        return "/"; // return the main page
    }
}