<div class="return">
    <?php
        if (isset($level->id)) { $referer = str_replace("new", $level->id, $referer); }; // replace the referer id if it's new by the actual level id so it's return correctly
    ?>
    <a href="<?= (preg_match("/play/", $referer) ? "/" : $referer) ?>"> <!-- to prevent infinite loop of back and fourth with return from level player then editor etc don't return to level player -->
        <i class="fa-solid fa-right-to-bracket fa-rotate-180"></i>
        <span class="visually-hidden">Go back</span>
    </a>
</div>
<div class="game-modal">
    <img src="/asset/img/landscape.gif" alt="">
    <h1 class="h2">Please use landscape mode</h1>
    <h2 class="h3">Keyboard required to play</h2>
</div>
<div class="loader">
    <img src="/asset/img/hero.png" alt="Hero image">
    <h2 class="h3">Loading please wait...</h2>
</div>