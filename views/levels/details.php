<?php include_once ROOT . "/views/components/nav.php" ?>
<?php if ($logged): ?>
    <div class="modal" id="post-comment-modal">
        <button class="close" onclick="closeModal(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>
        <form action="/levels/postcomment/<?= $level->id ?>" method="post" class="comment-form">
            <label for="comment" class="h4">Post a comment</label>
            <textarea name="comment" id="comment" cols="30" rows="10" placeholder="Write your comment here" data-err="You comment should be at least 5 characters long" data-check="/^.{5,300}$/"></textarea>
            <button type="submit" class="btn">Submit</button>
        </form>
    </div>

<?php endif; ?>
<section class="level-card">
    <article class="infos">
        <h1 class="h1"><?= $level->name ?></h1>
        <div class="difficulty">
            <h2 class="h3">difficulty rating:</h2>
            <div class="slider">
                -
                <div class="scale scale-point" style="--pos: <?= $level->rating ?>%"></div>
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
            <?php if ($logged && $user["id"] === $level->created_by): ?>
                <a href="/levels/editor/<?= $level->id ?>" class="btn"><i class="fa-solid fa-gear"></i>Editor</a>
            <?php endif; ?>
        </div>
    </article>

    <article class="comments">
        <h2 class="h2">Comments</h2>
        <?php if ($logged): ?>
            <button class="btn post-btn" onclick="openModal('post-comment-modal')"><i class="fas fa-comment"></i> Post a comment</button>
        <?php endif; ?>
        <?php foreach ($level->comments as $comment): ?>
            <div class="comment glass-bg">
                <h3 class="h3"><?= $comment->username ?></h3>
                <p><?= $comment->comment ?></p>
            </div>
        <?php endforeach; ?>
    </article>
</section>
<?php include_once ROOT . "/views/components/footer.php" ?>
