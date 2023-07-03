<?php
namespace App\Controllers;
use App\Models\UsersModel;
use App\Core\Tools;


class UsersController extends controller {
    public function register() {
        if (!empty($_POST)) {
            // check that everything is filled
            Tools::checkEntriesValidity($_POST, "/users/register", "register-modal");
            // set the redirect path
            if (!isset($_POST["redirect"])) {
                $_POST["redirect"] = $_SERVER["HTTP_REFERER"];
            }
            /* ----------------------------- SPECIFIC CHECK ----------------------------- */
            // mail
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL)) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid mail"]
                ], "register-modal");
            }

            // name
            if(!preg_match("/^[-a-z0-9\/]{4,20}$/", $_POST["username"])) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid username"]
                ], "register-modal");
            }

            // pass
            if(!preg_match("/.{6,}/", $_POST["pass"]) || $_POST["pass"] !== $_POST["pass-confirm"]) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid password"]
                ], "register-modal");
            }
            /* ----------------------------- DATA VALIDATED ----------------------------- */
            $mail = strip_tags($_POST["mail"]);
            $username = strip_tags($_POST["username"]);
            $password = password_hash($_POST["pass"], PASSWORD_ARGON2ID);
            $usersModel = new UsersModel();
            // check if entries arleady taken
            if ($usersModel->findBy(["username"=>$username])) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "This username is arleady taken"]
                ], "register-modal");
            }
            if ($usersModel->findBy(["mail"=>$mail])) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "This mail arleady exist"]
                ], "register-modal");
            }
            // all ok -> create user
            $usersModel->setMail($mail)
                ->setUsername($username)
                ->setPassword($password)
                ->create($usersModel);
            // create session
            $user = $usersModel->findBy(["mail"=>$mail])[0];
            $_SESSION["user"] = [
                "id" => $user->id,
                "username" => $user->username,
            ];
            // redirect
            Tools::redirectResponse($_POST["redirect"], 200, [
                ['type' => "success", "text" => "Yeahhh welcome $user->username!"]
            ]);
        } else {
            // display register page
            if (Tools::IsLogged(false)) { // if user is logged don't allow access
                Tools::redirectResponse($_SERVER["HTTP_REFERER"], 200, [
                    ["type" => "success", "You are already signed-in"]
                ]);
            }
            $this->render("users/register");
        }
    }
    public function login() {
        if (!empty($_POST)) {
            // check that everything is filled
            Tools::checkEntriesValidity($_POST, "/users/login", "login-modal");
            // set the redirect path
            if (!isset($_POST["redirect"])) {
                $_POST["redirect"] = $_SERVER["HTTP_REFERER"];
            }
            
            /* ----------------------------- SPECIFIC CHECK ----------------------------- */
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL)) { // mail
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid mail"]
                ], "login-modal");
            }
            if(!preg_match("/.{6,}/", $_POST["pass"])) { // pass
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid password"]
                ], "login-modal");
            }

            /* ----------------------------- DATA VALIDATED ----------------------------- */
            $mail = strip_tags($_POST["mail"]);
            $password = $_POST["pass"];
            $usersModel = new UsersModel();
            // try to find user
            $user = $usersModel->findBy(["mail" => $mail]);
            if (!$user) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Incorrect mail or password"]
                ], "login-modal");
            }
            // user mail exist -> check password
            $user = $usersModel->hydrate($user[0]);
            if (!password_verify($password, $usersModel->getPassword())) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Incorrect mail or password"]
                ], "login-modal");
            }
            // logged in -> session
            $_SESSION["user"] = [
                "id" => $user->getId(),
                "username" => $user->getUsername(),
            ];
            // redirect
            Tools::redirectResponse($_POST["redirect"], 200, [
                ['type' => "success", "text" => "Yeahhh welcome back " . $user->getUsername() . "!"]
            ]);
        } else {
            // display login page
            if (Tools::IsLogged(false)) { // if user is logged don't allow access
                Tools::redirectResponse($_SERVER["HTTP_REFERER"], 200, [
                    ["type" => "success", "You are already logged"]
                ]);
            }
            $this->render("users/login");
        }
    }

    public function disconnect() {
        unset($_SESSION["user"]);
        Tools::redirectResponse((isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : "/"), 200, [
            ['type' => "success", "text" => "You are now signed out"]
        ]);
    }
}