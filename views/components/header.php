<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Icytrails - free to play online comunity platform game">
    <link rel="icon" href="/asset/img/favicon.ico" type="image/x-icon">
    <title>Icytrails</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
    <?php if(!preg_match("/users/", $_GET["p"]) && !$logged): ?>
    <div class="modal" id="login-modal">
        <button class="close" onclick="closeModal(this.parentNode)">
            <i class="fa-solid fa-xmark"></i>
            <span class="visually-hidden">Close modal</span>
        </button>
        <form action="/users/login" method="post" class="form-modal">
            <label for="login-mail">Your mail</label>
            <input type="email" name="mail" id="login-mail" placeholder="mail@adress.com" data-err="Please enter a valid mail" data-check="/^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i" required>
            <label for="login-pass">Password</label>
            <input type="password" name="pass" id="login-pass" placeholder="Your password" data-err="Password must be at least 6 characters" data-check="/^.{6,}$/" required>
            <input type="submit" value="Login" class="btn">
            <a href="">forgot password?</a>
        </form>
    </div>

    <div class="modal" id="register-modal">
        <button class="close" onclick="closeModal(this.parentNode)">
            <i class="fa-solid fa-xmark"></i>
            <span class="visually-hidden">Close modal</span>
        </button>
        <form action="/users/register" method="post" class="form-modal">
            <label for="register-name">Username</label>
            <input type="text" name="username" id="register-name" placeholder="Your cool username" autocomplete="name" data-err="Please enter a valid username" data-check="/^[-a-z0-9/]{4,20}$/" required>
            <label for="register-mail">Your mail</label>
            <input type="email" name="mail" id="register-mail" placeholder="mail@adress.com" data-err="Please enter a valid mail" data-check="/^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i" required>
            <label for="register-pass">Password</label>
            <input type="password" name="pass" id="register-pass" placeholder="Your password" data-err="Password must be at least 6 characters" data-check="/^.{6,}$/" required>
            <input type="password" name="pass-confirm" placeholder="Confirm password"  data-err="Password dosen't match" data-check="=id:register-pass" required>
            <input type="submit" value="Register" class="btn">
        </form>
    </div>
    <?php endif; ?>
<?php
    if (isset($_SESSION["messages"])):
    foreach ($_SESSION["messages"] as $index=>$message):
?>
    <article class="notification <?= $message["type"]; ?>" style="margin-top: calc(1em + 3 * <?= $index; ?>em">
        <?= $message["text"]; ?>
    </article>
<?php
    endforeach;
    endif;
?>