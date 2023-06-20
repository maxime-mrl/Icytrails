<?php
namespace App\Controllers;
use App\Models\UsersModel;


class UsersController extends controller {
    public function register() {
        $error = false;
        if (!empty($_POST)) {
            foreach($_POST as $field => $value) { // check that nothing is empty or not plain text
                if (empty($value)) {
                    die("Merci de remplir le champs $field");
                    $error = true;
                    break;
                }
                if (strip_tags($value) != $value) {
                    die("you should only enter plain text");
                    $error = true;
                    break;
                }
            }
            // check mail
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL) && !$error) {
                die("incorect adress");
                $error = true;
            }
            // check name
            if(!preg_match("/^[-a-z0-9\/]{4,20}$/", $_POST["username"])) {
                die("incorect username");
                $error = true;
            }
            // check pass
            if(!preg_match("/.{6,}/", $_POST["pass"]) || $_POST["pass"] !== $_POST["pass-confirm"]) {
                die("incorect password");
                $error = true;
            }

            if (!$error) {
                // data validated
                $mail = strip_tags($_POST["mail"]);
                $username = strip_tags($_POST["username"]);
                $password = password_hash($_POST["pass"], PASSWORD_ARGON2ID);
                $usersModel = new UsersModel();
                if ($usersModel->findBy(["username"=>$username])) {
                    die("username arleady used");
                    $error = true;
                }
                if ($usersModel->findBy(["mail"=>$mail])) {
                    die("mail arleady used");
                    $error = true;
                }

                $usersModel->setMail($mail)
                    ->setUsername($username)
                    ->setPassword($password)
                    ->create($usersModel);
                // redirect back to main page
                if ($_POST["redirect"][0] != "/") { // add first / if missing
                    $_POST["redirect"] = "/" . $_POST["redirect"];
                } 
                http_response_code(301);
                header("location: " . $_POST["redirect"]);
            }
        } else {
            $this->render("users/register");
        }
    }
    public function login() {
        $error = false;
        if (!empty($_POST)) {
            foreach($_POST as $field => $value) { // check that nothing is empty or not plain text
                if (empty($value)) {
                    die("Merci de remplir le champs $field");
                    $error = true;
                    break;
                }
                if (strip_tags($value) != $value) {
                    die("you should only enter plain text");
                    $error = true;
                    break;
                }
            }
            // check mail
            if (!filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL) && !$error) {
                die("incorect adress");
                $error = true;
            }
            // check pass
            if(!preg_match("/.{6,}/", $_POST["pass"])) {
                die("incorect password");
                $error = true;
            }

            if (!$error) {
                // data validated
                $mail = strip_tags($_POST["mail"]);
                $password = $_POST["pass"];
                $usersModel = new UsersModel();
                echo $usersModel->getPassword();

                $user = $usersModel->findBy(["mail" => $mail]);
                if (!$user) {
                    die("incorect mail or password");
                    $error = true;
                } else {
                    $user = $usersModel->hydrate($user[0]);
                    if (password_verify($password, $usersModel->getPassword())) {
                        $_SESSION["user"] = [
                            "id" => $user->getId(),
                            "username" => $user->getUsername(),
                        ];
                        // redirect back to main page
                        if ($_POST["redirect"][0] != "/") { // add first / if missing
                            $_POST["redirect"] = "/" . $_POST["redirect"];
                        } 
                        header("location: " . $_POST["redirect"]);
                    } else {
                        die("incorect mail or password");
                        $error = true;
                    }
                }
            }
        } else {
            $this->render("users/login");
        }
    }
}