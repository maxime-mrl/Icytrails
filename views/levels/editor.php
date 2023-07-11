<?php include_once ROOT . "/views/components/game.php" ?>
<div id="editor-container" class="modal-oppened">
    <div class="editor">
        <h1 class="h1 editor-title">IcyTrails level editor</h1>
        <canvas width="1280" height="720" id="game-canvas"></canvas>
        <section class="level-title">
            <label for="input-title">Title:</label>
            <input type="text" name="title" id="input-title" placeholder="Level title" data-err="Please enter a valid title" data-check="/^.{3,100}$/" value="<?= ($level != false ?$level->name : '') ?>" required>
        </section>
        <section class="controls">
            <form action="/<?= $_GET["p"] ?>" method="post" class="visibility" id="form-sumbit">
                <div class="select">
                    <i class="fa-solid fa-chevron-down"></i>
                    <select name="visibility" id="visibility">
                        <?php $visibility = isset($level->visibility) ? $level->visibility : 0 ?>
                        <option value="0">Visibility: Un-listed</option>
                        <option value="1" <?= ($visibility == 1 ? "selected" : "") ?>>Visibility: Public</option>
                    </select>
                </div>
                <div style="display:none">
                    <input type="text" name="name" id="title-box" readonly>
                    <input type="text" name="level" id="level-box" readonly>
                </div>
            </form>
            <article>
                <button class="btn succes-bg" id="save-btn">Save change</button>
            </article>
            <article>
                <button class="btn succes-bg" id="try-btn">Save change and try</button>
            </article>
            <?php if (isset($level->id)): ?>
                <form action="/levels/delete/<?= $level->id ?>" method="post" onsubmit="return confirm('Are you sure you want to delete level <?= $level->name ?>');">
                    <input type="submit" class="btn fail-bg" value="Delete">
                </form>
            <?php endif; ?>
        </section>
    </div>
    <section class="blocks-select">
        <div class="bg"></div>
        <article class="solid">
            <h2 class="h3">Solid blocks</h2>
            <div class="blocks"></div>
        </article>
        <article class="top-solid">
            <h2 class="h3">Solid blocks from top only</h2>
            <div class="blocks"></div>
        </article>
        <article class="background">
            <h2 class="h3">background and decoration</h2>
            <div class="blocks"></div>
        </article>
        <article class="kill">
            <h2 class="h3">Instant death !</h2>
            <div class="blocks"></div>
        </article>
        <article class="specials">
            <h2 class="h3">Others</h2>
            <div class="blocks"></div>
        </article>
    </section>
    <button class="modal-button" onclick="toggleEditor()">
        <i class="fa-solid fa-chevron-left"></i>
        <span class="visually-hidden">Close block tab</span>
    </button>
</div>
<!-- tippy import (for tooltips) -->
<script src="/script/ext/popper.min.js"></script>
<script src="/script/ext/tippy-bundle.umd.js"></script>
<!-- main game script -->
<script>const compressedLevel = "<?= ($level != false ?$level->level : false) ?>";</script>
<script src="/script/editor.js" type="module"></script>
