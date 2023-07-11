<?php
namespace App\Controllers;
use App\Models\UsersModel;
use App\Core\Tools;


class UsersController extends controller {
    public function register() { // display register page and handle user register
        if (!empty($_POST)) {
            // check that everything is filled
            Tools::checkEntriesValidity($_POST, "/users/register", "register-modal");
            // set the redirect path
            if (!isset($_POST["redirect"])) {
                $_POST["redirect"] = Tools::getReferer();
            }
            /* ----------------------------- SPECIFIC CHECK ----------------------------- */
            // mail
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL)) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid mail"]
                ], "register-modal");
            }

            // name
            if(!preg_match("/^[-a-z0-9\/]{4,20}$/i", $_POST["username"])) {
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
                Tools::redirectResponse(Tools::getReferer(), 200, [
                    ["type" => "success", "text" => "You are already signed-in"]
                ]);
            }
            $this->render("users/register");
        }
    }
    public function login() { // display login page and handle user login
        if (!empty($_POST)) {
            // check that everything is filled
            Tools::checkEntriesValidity($_POST, "/users/login", "login-modal");
            // set the redirect path
            if (!isset($_POST["redirect"])) {
                $_POST["redirect"] = Tools::getReferer();
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
                Tools::redirectResponse(Tools::getReferer(), 200, [
                    ["type" => "success", "text" => "You are already logged"]
                ]);
            }
            $this->render("users/login");
        }
    }

    public function disconnect() { // disconnect user (remove session)
        unset($_SESSION["user"]);
        Tools::redirectResponse(Tools::getReferer(), 200, [
            ['type' => "success", "text" => "You are now signed out"]
        ]);
    }

    public function settings() { // display settings page and update user infos
        $user = Tools::IsLogged(); // need user in all case
        if (!empty($_POST)) {
            Tools::checkEntriesValidity($_POST, "/users/settings");
            /* ----------------------------- SPECIFIC CHECK ----------------------------- */
            // check pass
            if(!preg_match("/.{6,}/", $_POST["pass"])) { // correctly provided
                Tools::redirectResponse("/users/settings", 200, [
                    ['type' => "error", "text" => "Please enter a valid password"]
                ]);
            }
            if (!password_verify($_POST["pass"], $user->password)) { // is the correct password
                Tools::redirectResponse("/users/settings", 200, [
                    ['type' => "error", "text" => "Incorrect password"]
                ]);
            }

            // check any optional entry to make sure if provided is correct
            if(!preg_match("/^[-a-z0-9\/]{4,20}$|^$/i", $_POST["username"])) {
                Tools::redirectResponse("/users/settings", 200, [
                    ['type' => "error", "text" => "Please enter a valid username"]
                ]);
            }
            if(!preg_match("/^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$|^$/i", $_POST["mail"])) {
                Tools::redirectResponse("/users/settings", 200, [
                    ['type' => "error", "text" => "Please enter a valid mail"]
                ]);
            }
            if(!preg_match("/^.{6,}$|^$/", $_POST["new-pass"]) || $_POST["new-pass"] !== $_POST["new-pass-confirm"]) {
                Tools::redirectResponse("/users/settings", 200, [
                    ['type' => "error", "text" => "Please enter a valid password"]
                ]);
            }
            /* -------------------------------- VALIDATED ------------------------------- */
            // set every data that should be edited
            $usersModel = new UsersModel();
            if (isset($_POST["username"])) {
                $usersModel->setUsername(strip_tags($_POST["username"]));
            }
            if (isset($_POST["mail"])) {
                $usersModel->setMail(strip_tags($_POST["mail"]));
            }
            if (isset($_POST["new-pass"])) {
                $usersModel->setPassword(password_hash($_POST["pass"], PASSWORD_ARGON2ID));
            }
            // update user
            $usersModel->updateById($usersModel, $user->id);
            // set back session
            $user = $usersModel->findById($user->id);
            $_SESSION["user"] = [
                "id" => $user->id,
                "username" => $user->username,
            ];
            Tools::redirectResponse("/users/settings", 200, [
                ['type' => "success", "text" => "Informations successfully updated"]
            ]);
        }
        $this->render("users/settings", [
            "mail"=>$user->mail,
            "username"=>$user->username,
        ]);
    }

    public function delete() { // delte user account
        /* ----------------------------- GENERAAL CHECK ----------------------------- */
        $user = Tools::IsLogged(); // user need to be logged to remove his account
        if (empty($_POST)) { // accept only request w/ post on this url
            Tools::redirectResponse("/users/settings", 200, [
                ['type' => "error", "text" => "Invalid request"]
            ]);
        }
        Tools::checkEntriesValidity($_POST, "/users/settings");
        /* ----------------------------- SPECIFIC CHECK ----------------------------- */
        // check pass
        if(!preg_match("/.{6,}/", $_POST["pass"])) { // correctly provided
            Tools::redirectResponse("/users/settings", 200, [
                ['type' => "error", "text" => "Please enter a valid password"]
            ]);
        }
        if (!password_verify($_POST["pass"], $user->password)) { // is the correct password
            Tools::redirectResponse("/users/settings", 200, [
                ['type' => "error", "text" => "Incorrect password"]
            ]);
        }
        /* ----------------------------- DATA VALIDATED ----------------------------- */
        $usersModel = new UsersModel();
        $usersModel->deleteById($user->id); // remove from db
        unset($_SESSION["user"]); // unset session
        Tools::redirectResponse("/", 200, [ // redirect
            ['type' => "success", "text" => "Your account and all your informations are now deleted permanently"]
        ]);
    }
}