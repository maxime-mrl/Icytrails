<div class="return">
    <a href="<?= $_SERVER["HTTP_REFERER"] ?>">
        <i class="fa-solid fa-right-to-bracket fa-rotate-180"></i>
    </a>
</div>
<div class="game-modal">
    <img src="/asset/img/landscape.gif" alt="">
    <h2 class="h2">Please use landscape mode</h2>
</div>
<canvas width="1280" height="720" id="game-canvas"></canvas>
<!-- main script -->
<script>const compressedLevel = "<?= $level ?>";</script>
<script src="/script/game.js" type="module"></script>