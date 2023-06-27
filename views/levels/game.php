<div class="return">
    <a href="<?= $_SERVER["HTTP_REFERER"] ?>">
        <i class="fa-solid fa-right-to-bracket fa-rotate-180"></i>
    </a>
</div>
<canvas width="1280" height="720" id="game-canvas"></canvas>
<!-- main script -->
<script>const compressedLevel = "<?= $level ?>";</script>
<script src="/script/game.js" type="module"></script>