<?php
$title_regex = '/^[-a-z0-9\/]{5,100}$/';
if (!empty($_POST)) {
    // check if all data are present
    if (empty($_POST["level"]) || empty($_POST["name"] || empty($_POST["visibility"]))) die("incorect data");
    // all data entries are present
    $level = json_decode($_POST["level"]);
    $title = strip_tags($_POST["name"]);
    $visibility = intval($_POST["visibility"]);
    // check if data are correct
    if (!is_int($level->spawn->x) || !is_int($level->spawn->y) || !is_int($level->end->x) || !is_int($level->end->y)) die("incorect data"); // spawn and end
    foreach($level->fg as $fg) if (!is_int($fg->x) || !is_int($fg->y) || !is_int($fg->t) || $fg->t > 100) die("incorect data"); // foreground blocks
    foreach($level->bg as $bg) if (!is_int($bg->x) || !is_int($bg->y) || !is_int($bg->t) || $bg->t > 100) die("incorect data"); // background blocks
    if (!preg_match($title_regex, $title)) die("incorect data"); // title
    if (!is_int($visibility) || $visibility > 1) die("incorect data"); /// visiblity
    // data entries are coherent -> we can continue
    echo "all checked \n";
    // compress level (can divide by up to 3 the total size of level compared to plain json)
    $compressedLevel = "{$level->spawn->x},{$level->spawn->y};{$level->end->x},{$level->end->y}b";
    foreach($level->bg as $bg) $compressedLevel .= "{$bg->x},{$bg->y},{$bg->t};";
    $compressedLevel .= "f";
    foreach($level->fg as $fg) $compressedLevel .= "{$fg->x},{$fg->y},{$fg->t};";
    echo $compressedLevel;
    // now we can save the level

    die;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="IcyTrails level editor - create your own level">
    <title>Icytrails creator</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <link rel="stylesheet" href="./stylesheets/style.css">
</head>
<body>
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
                <input type="text" name="title" id="input-title" placeholder="Level title" data-err="Please enter a valid title" data-check=<?=$title_regex?>>
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
    <script src="script/ext/popper.min.js"></script>
    <script src="script/ext/tippy-bundle.umd.js"></script>
    <!-- main game script -->
    <script src="script/editor.js" type="module"></script>
    <script src="script/app.js"></script>
</body>
</html>