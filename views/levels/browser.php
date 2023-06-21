<?php include_once ROOT . "/views/components/nav.php" ?>

<section class="level-list">
    <?php foreach ($data as $level): ?>
        <article class="level">
            <div class="name">
                <h2 class="h3"><?= $level->name ?></h2>
                <a class="btn play" href="/levels/play/<?= $level->id ?>"><i class="fa-solid fa-play"></i> Play !</a>
                <a class="btn details" href="/levels/detail/<?= $level->id ?>"><i class="fa-solid fa-plus"></i> More info</a>
            </div>
            <a  href="/levels/detail/<?= $level->id ?>" class="infos">
                <div class="slider">
                    -
                    <div class="scale scale-point" style="--pos: 10%"></div>
                    +
                </div>
                <div class="comments">
                    <i class="fa-solid fa-comments"></i>
                    <p>5</p>
                </div>
            </a>
        </article>
    <?php endforeach; ?>
</section>
<?php include_once ROOT . "/views/components/footer.php" ?>