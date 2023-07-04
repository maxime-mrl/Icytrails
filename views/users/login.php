<?php include_once ROOT . "/views/components/nav.php" ?>
<div class="modal active" id="login-modal" style="z-index: 0">
    <form action="/users/login" method="post" class="form-modal">
        <h1 class="h1">Login</h1>
        <label for="login-mail">Your mail</label>
        <input type="email" name="mail" id="login-mail" placeholder="mail@adress.com" data-err="Please enter a valid mail" data-check="/^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i" required>
        <label for="login-pass">Password</label>
        <input type="password" name="pass" id="login-pass" placeholder="Your password" data-err="Password must be at least 6 characters" data-check="/^.{6,}$/" required>
        <input type="text" name="redirect" value="<?= $referer ?>" readonly style="display:none">
        <input type="submit" value="Login" class="btn">
        <a href="">forgot password?</a>
    </form>
</div>
