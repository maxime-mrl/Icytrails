<?php
namespace App\Controllers;
use App\Models\UsersModel;
use App\Core\Tools;


class UsersController extends controller {
    public function register() {
        $error = false;
        if (!empty($_POST)) {
            // check that everything is filled
            Tools::checkEntriesValidity($_POST, "/users/register");
            // set the redirect path (add first / if missing)
            if ($_POST["redirect"][0] != "/") {
                $_POST["redirect"] = "/" . $_POST["redirect"];
            }
            /* ----------------------------- SPECIFIC CHECK ----------------------------- */
            // mail
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL) && !$error) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid mail"]
                ]);
            }

            // name
            if(!preg_match("/^[-a-z0-9\/]{4,20}$/", $_POST["username"])) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid username"]
                ]);
            }
            // pass
            if(!preg_match("/.{6,}/", $_POST["pass"]) || $_POST["pass"] !== $_POST["pass-confirm"]) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid password"]
                ]);
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
                ]);
            }
            if ($usersModel->findBy(["mail"=>$mail])) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "This mail arleady exist"]
                ]);
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
            $this->render("users/register");
        }
    }
    public function login() {
        $error = false;
        if (!empty($_POST)) {
            // check that everything is filled
            Tools::checkEntriesValidity($_POST, "/users/login");
            // set the redirect path (add first / if missing)
            if ($_POST["redirect"][0] != "/") {
                $_POST["redirect"] = "/" . $_POST["redirect"];
            }
            
            /* ----------------------------- SPECIFIC CHECK ----------------------------- */
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL) && !$error) { // mail
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid mail"]
                ]);
            }
            if(!preg_match("/.{6,}/", $_POST["pass"])) { // pass
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Please enter a valid password"]
                ]);
            }

            /* ----------------------------- DATA VALIDATED ----------------------------- */
            $mail = strip_tags($_POST["mail"]);
            $password = $_POST["pass"];
            $usersModel = new UsersModel();

            $user = $usersModel->findBy(["mail" => $mail]);
            if (!$user) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Incorrect mail or password"]
                ]);
            }
            $user = $usersModel->hydrate($user[0]);
            if (!password_verify($password, $usersModel->getPassword())) {
                Tools::redirectResponse($_POST["redirect"], 200, [
                    ['type' => "error", "text" => "Incorrect mail or password"]
                ]);
            }
            $_SESSION["user"] = [
                "id" => $user->getId(),
                "username" => $user->getUsername(),
            ];
            // redirect
            Tools::redirectResponse($_POST["redirect"], 200, [
                ['type' => "success", "text" => "Yeahhh welcome back " . $user->getUsername() . "!"]
            ]);
        } else {
            $this->render("users/login");
        }
    }
}