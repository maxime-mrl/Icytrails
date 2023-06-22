<?php include_once ROOT . "/views/components/nav.php" ?>
<section class="level-card">
    <h1 class="h1"><?= $level->name ?></h1>
    <div class="difficulty">
        <h2 class="h3">difficulty rating:</h2>
        <div class="slider">
            -
            <div class="scale scale-point" style="--pos: <?= $level->ratingAverage ?>%"></div>
            +
        </div>
        <?php if (isset($level->selfRating)): ?>
            <form action="/levels/setrating/<?= $level->id ?>" method="post">
                <label for="difficulty">Your rating:</label>
                <input type="range" name="difficulty" class="scale" value="<?= $level->selfRating ?>">
                <button type="submit" class="btn">Submit</button>
            </form>
        <?php endif; ?>
    </div>
    <div class="actions">
        <a href="/levels/play/<?= $level->id ?>" class="btn"><i class="fa-solid fa-play"></i> Play !</a>
        <?php if (isset($_SESSION["user"]["id"])): ?>
            <?php if ($_SESSION["user"]["id"] === $level->created_by): ?>
                <a href="/levels/editor/<?= $level->id ?>" class="btn"><i class="fa-solid fa-gear"></i>Editor</a>
            <?php endif; ?>
        <?php endif; ?>
    </div>
    <div class="comments">
        <h2 class="h2">Comments</h2>
        <?php if (isset($level->selfRating)): ?>
            <form action="/levels/postcomment/<?= $level->id ?>" method="post">
                <label for="comment" class="h4">Post a comment</label>
                <textarea name="comment" id="comment" cols="30" rows="10" placeholder="Write your comment here" data-err="You comment should be at least 5 characters long" data-check="/^.{5,}$/"></textarea>
                <button type="submit" class="btn">Submit</button>
            </form>
        <?php endif; ?>
        <?php foreach ($level->comments as $comment): ?>
            <article>
                <h3 class="h3"><?= $comment->posted_by_name ?></h3>
                <p><?= $comment->comment ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>
<?php include_once ROOT . "/views/components/footer.php" ?>
