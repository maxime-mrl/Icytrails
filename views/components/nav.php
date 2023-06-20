<button class="burger-btn" onclick="toggleNavbar()">
    <i class="fa-solid fa-bars"></i>
</button>
<nav class="navbar">
    <ul class="left">
        <li>
            <a href="/"><img src="/asset/img/logo-transparent.png" alt="Icytrails logo" class="logo"></a>
        </li>
        <li>
            <a href="/levels" class="link">Browse levels</a>
        </li>
    </ul>
    <ul class="right">
        <?php if(preg_match("/users/", $_GET["p"])): ?>
            <li>
                <a class="link" href="/users/register">Register</a>
            </li>
            <li>
            </li>
            <li>
                <a class="link" href="/users/login">Login</a>
            </li>
        <?php elseif (!isset($_SESSION["user"])): ?>
            <li>
                <button class="btn" onclick="openModal('register-modal')">Register</button>
            </li>
            <li>
                <button class="btn" onclick="openModal('login-modal')">Login</button>
            </li>
        <?php else: ?>
            <li>
                Hello <?= $_SESSION["user"]["username"]; ?>,
            </li>
            <li>
                <a class="link" href="/users/settings">Accout settings</a>
            </li>
        <?php endif; ?>
    </ul>
</nav>
<div class="margin"></div>
