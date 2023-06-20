<?php
function IsinArray($array, $filter) {
    foreach ($array as $item) if ($filter == $item) return true;
    return false;
}
$title_regex = '/^[-a-z0-9\/]{5,100}$/';
if (!empty($_POST)) {
    // check if all data are present
    if (empty($_POST["level"]) || empty($_POST["name"] || empty($_POST["visibility"]))) die("incorect data");
    // all data entries are present
    $level = json_decode($_POST["level"]);
    $title = strip_tags($_POST["name"]);
    $visibility = intval($_POST["visibility"]);
    // get every possible blocks code
    $blocks = [];
    foreach (json_decode(file_get_contents(__DIR__ . "/asset/json/blocks.json"))->blocks as $block) $blocks[] = $block[1];
    // check if level data is correct
    if (!is_int($level->spawn->x) || !is_int($level->spawn->y) || !is_int($level->end->x) || !is_int($level->end->y)) die("incorect data"); // spawn and end
    // foreground blocks
    foreach($level->fg as $fg) {
        if (!is_int($fg->x) || !is_int($fg->y) || !is_int($fg->t) || $fg->t > 100) die("incorect data");
        if (!IsinArray($blocks, $fg->t)) die("incorect data");
    }
    // background blocks
    foreach($level->bg as $bg) {
        if (!is_int($bg->x) || !is_int($bg->y) || !is_int($bg->t) || $bg->t > 100) die("incorect data");
        if (!IsinArray($blocks, $bg->t)) die("incorect data");
    }
    // others
    if (!preg_match($title_regex, $title)) die("incorect data"); // title
    if (!is_int($visibility) || $visibility > 1) die("incorect data"); /// visiblity
    // data entries are coherent -> we can continue
    // compress level (can divide by up to 3 the total size of level compared to plain json)
    $compressedLevel = "{$level->spawn->x},{$level->spawn->y};{$level->end->x},{$level->end->y}b";
    foreach($level->bg as $bg) $compressedLevel .= "{$bg->x},{$bg->y},{$bg->t};";
    $compressedLevel .= "f";
    foreach($level->fg as $fg) $compressedLevel .= "{$fg->x},{$fg->y},{$fg->t};";
    // echo $compressedLevel;
    // now we can save the level

    function decompressLevel($compressedLevel) { // decompress level function here for when we need it
        $intermediate = preg_split('/[a-z]/i', $compressedLevel); // split at every letter to get spawn/end foreground and background
        foreach ($intermediate as $key => $elem) $intermediate[$key] = explode(";", $elem);
        $decompressedLevel = [
            'spawn' => ['x' => intval( explode(',', $intermediate[0][0])[0] ), 'y' => intval( explode(',', $intermediate[0][0])[1] )],
            'end' => ['x' => intval( explode(',', $intermediate[0][1])[0] ), 'y' => intval( explode(',', $intermediate[0][1])[1] )],
            'bg' => [],
            'fg' => []
        ];
        foreach ($intermediate[1] as $bg) {
            $bg = explode(',', $bg);
            if (!isset($bg[0]) || !isset($bg[1]) || !isset($bg[2])) continue;
            $decompressedLevel['bg'][] = ['x' => intval($bg[0]), 'y' => intval($bg[1]), 't' => intval($bg[2])];
        }
    
        foreach ($intermediate[2] as $fg) {
            $fg = explode(',', $fg);
            if (!isset($fg[0]) || !isset($fg[1]) || !isset($fg[2])) continue;
            $decompressedLevel['fg'][] = ['x' => intval($fg[0]), 'y' => intval($fg[1]), 't' => intval($fg[2])];
        }
        return $decompressedLevel;
    }
    
    die; // don't print the document because with a post it should be just like some kinds of api
}
?>