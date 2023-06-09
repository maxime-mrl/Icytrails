<button class="burger-btn" onclick="toggleNavbar()">
    <i class="fa-solid fa-bars"></i>
    <span class="visually-hidden">Nav toggle button for mobile</span>
</button>
<nav class="navbar">
    <ul class="left">
        <li>
            <a href="/"><img src="/asset/img/logo-transparent.png" alt="Icytrails logo" class="logo"></a>
        </li>
        <li>
            <a href="/levels" class="link">Browse levels</a>
        <?php if ($logged): ?>
            <li>
                <a href="/levels/editor/new" class="link left-space">Create a level</a>
            </li>
        <?php endif; ?>
        </li>
    </ul>
    <ul class="right">
        <?php if(preg_match("/login/", $_GET["p"])): ?>
            <li>Don't have an account yet?</li>
            <li><a class="link" href="/users/register">Register</a></li>
        <?php elseif (preg_match("/register/", $_GET["p"])): ?>
            <li>Arleady have an account?</li>
            <li> <a class="link" href="/users/login">Login</a></li>
        <?php elseif (!$logged): ?>
            <li><button class="btn" onclick="openModal('register-modal')">Register</button></li>
            <li><button class="btn" onclick="openModal('login-modal')">Login</button></li>
        <?php else: ?>
            <div class="drop-down">
                <p>Hello <?= $user["username"]; ?> <i class="fa-solid fas fa-angle-down"></i></p>
                <ul>
                    <li><a class="link" href="/users/settings">Accout settings</a></li>
                    <li><a class="link fail-color" href="/users/disconnect">sign-out</a></li>
                </ul>
            </div>
            <ul class="mobile-drop-down">
                <li>Hello <?= $user["username"]; ?> <i class="fa-solid fas fa-angle-down"></i></li>
                <li><a class="link" href="/users/settings">Accout settings</a></li>
                <li><a class="link fail-color" href="/users/disconnect">sign-out</a></li>
            </ul>
            <li><a class="link left-space" href="/levels/own">Your levels</a></li>
        <?php endif; ?>
    </ul>
</nav>
<div class="margin"></div>
