<?php include_once ROOT . "/views/components/nav.php" ?>
<section class="level-list">
    <?php if (count($levels) === 0): ?>
        <article class="level-empty">
            <h2 class="h2">Uh Oh... There is nothing here</h2>
            <h3 class="h3">But it shouldn't</h3>
            <a href="/levels/editor" class="btn">Create a level</a>
        </article>
    <?php else: foreach ($levels as $level): ?>
        <article class="level">
            <div class="name">
                <h2 class="h3"><?= $level->name ?></h2>
                <a class="btn play" href="/levels/play/<?= $level->id ?>"><i class="fa-solid fa-play"></i> Play !</a>
                <a class="btn details" href="/levels/details/<?= $level->id ?>"><i class="fa-solid fa-plus"></i> More info</a>
            </div>
            <a href="/levels/details/<?= $level->id ?>" class="infos">
                <div class="slider">
                    -
                    <div class="scale scale-point" style="--pos: <?= $level->rating ?>%"></div>
                    +
                </div>
                <div class="comments">
                    <i class="fa-solid fa-comments"></i>
                    <p><?= count($level->comments) ?></p>
                </div>
            </a>
        </article>
    <?php endforeach; endif; ?>
</section>
<?php include_once ROOT . "/views/components/footer.php" ?>