<?php include_once ROOT . "/views/components/nav.php" ?>
<div class="modal active" id="register-modal" style="z-index: 0">
    <form action="/users/register" method="post" class="form-modal">
        <h1 class="h1">Register</h1>
        <label for="register-name">Username</label>
        <input type="text" name="username" id="register-name" placeholder="Your cool username" autocomplete="name" data-err="Please enter a valid username" data-check="/^[-a-z0-9/]{4,20}$/">
        <label for="register-mail">Your mail</label>
        <input type="email" name="mail" id="register-mail" placeholder="mail@adress.com" data-err="Please enter a valid mail" data-check="/^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i">
        <label for="register-pass">Password</label>
        <input type="password" name="pass" id="register-pass" placeholder="Your password" data-err="Password must be at least 6 characters" data-check="/.{6,}/">
        <input type="password" name="pass-confirm" placeholder="Confirm password"  data-err="Password dosen't match" data-check="=id:register-pass">
        <input type="text" name="redirect" value="<?= $_SERVER["HTTP_REFERER"] ?>" readonly style="display:none">
        <input type="submit" value="Register" class="btn">
    </form>
</div>