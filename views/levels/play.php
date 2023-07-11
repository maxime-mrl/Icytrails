<?php include_once ROOT . "/views/components/game.php" ?>
<canvas width="1280" height="720" id="game-canvas"></canvas>
<!-- main script -->
<script>const compressedLevel = "<?= $level->level ?>";</script>
<script src="/script/game.js" type="module"></script>