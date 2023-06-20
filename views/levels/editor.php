<div id="editor-container" class="modal-oppened">
    <div class="editor">
        <h1 class="h1 editor-title">IcyTrails level editor</h1>
        <canvas width="1280" height="720" id="game-canvas"></canvas>
        <section class="controls">
            <article class="visibility">
                <div class="select">
                    <i class="fa-solid fa-chevron-down"></i>
                    <select name="visibility" id="visibility">
                        <option value="1">Visibility: Public</option>
                        <option value="0">Visibility: Un-listed</option>
                    </select>
                </div>
            </article>
            <article>
                <button class="btn succes-bg" id="save-btn">Save change</button>
            </article>
            <article>
                <button class="btn succes-bg" id="try-btn">Save change and try</button>
            </article>
            <article>
                <button class="btn fail-bg">Delete</button>
            </article>
        </section>
        <section class="level-title">
            <label for="input-title">Title:</label>
            <input type="text" name="title" id="input-title" placeholder="Level title" data-err="Please enter a valid title" data-check="/^[-a-z0-9\/]{5,100}$/">
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
    </button>
</div>
<!-- tippy import (for tooltips) -->
<script src="/script/ext/popper.min.js"></script>
<script src="/script/ext/tippy-bundle.umd.js"></script>
<!-- main game script -->
<script src="/script/editor.js" type="module"></script>
