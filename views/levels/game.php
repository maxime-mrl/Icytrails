<?php var_dump($level); ?>
<canvas width="1280" height="720" id="game-canvas"></canvas>
<!-- main script -->
<script>const compressedLevel = "<?= $level ?>";</script>
<script src="/script/game.js" type="module"></script>