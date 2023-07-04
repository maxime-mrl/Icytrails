<?php include_once ROOT . "/views/components/nav.php" ?>
<h1 class="h1 settings-title">Hello <?= $username ?></h1>
<h2 class="h3 align-center">Update your informations</h2>
<form action="/users/settings" method="post" class="update-infos">
    <p>You can leave blank all value that should not be updated</p>

        <label for="update-name">Username</label>
        <input type="text" name="username" id="update-name" placeholder="Your even cooler username" autocomplete="name" data-err="Please enter a valid username" data-check="/^[-a-z0-9/]{4,20}$|^$/" value="<?= $username ?>">

        <label for="update-mail">Mail</label>
        <input type="email" name="mail" id="update-mail" placeholder="mail@adress.com" data-err="Please enter a valid mail" data-check="/^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$|^$/i" value="<?= $mail ?>">

        <label for="update-pass">Password</label>
        <input type="password" name="new-pass" id="update-pass" placeholder="Your new password" data-err="Password must be at least 6 characters" data-check="/^.{6,}$|^$/">
        <input type="password" name="new-pass-confirm" placeholder="Confirm password"  data-err="Password dosen't match" data-check="=id:update-pass">

        <div class="space"></div>  

        <label for="register-pass">Confirm your actual password</label>
        <input type="password" name="pass" id="check-pass" placeholder="Your old password" data-err="Password must be at least 6 characters" data-check="/^.{6,}$/" required>
        <input type="submit" value="Validate" class="btn">
</form>
<h2 class="h3 align-center">Delete account</h2>
<form class="update-infos" action="/users/delete" method="post" onsubmit="return confirm('Are you sure you want to delete your account?');">
    <label for="register-pass">Confirm your actual password</label>
    <input type="password" name="pass" id="check-pass" placeholder="Your password" data-err="Password must be at least 6 characters" data-check="/^.{6,}$/" required>
    <input type="submit" class="btn fail-bg" value="Delete account">
</form>
<?php include_once ROOT . "/views/components/footer.php" ?>
