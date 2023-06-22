<?php include_once ROOT . "/views/components/nav.php" ?>
<section class="level-card">
    <h1 class="h1"><?= $level->name ?></h1>
        <a href="/levels/play/<?= $level->id ?>" class="btn"><i class="fa-solid fa-play"></i> Play !</a>
        <div class="difficulty">
            <h2 class="h3">difficulty rating:</h2>
            <div class="slider">
                -
                <div class="scale scale-point" style="--pos: 10%"></div>
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
        <div class="comments">
            <h2 class="h2">Comments</h2>
            <article>
                <h3 class="h3">Name</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore earum numquam velit eaque dolore illum iusto quas odio, quaerat, quia placeat soluta ab autem ad ea veniam nemo doloremque molestias.</p>
            </article>
            <article>
                <h3 class="h3">Name</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore earum numquam velit eaque dolore illum iusto quas odio, quaerat, quia placeat soluta ab autem ad ea veniam nemo doloremque molestias.</p>
            </article>
            <article>
                <h3 class="h3">Name</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore earum numquam velit eaque dolore illum iusto quas odio, quaerat, quia placeat soluta ab autem ad ea veniam nemo doloremque molestias.</p>
            </article>
            <article>
                <h3 class="h3">Name</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore earum numquam velit eaque dolore illum iusto quas odio, quaerat, quia placeat soluta ab autem ad ea veniam nemo doloremque molestias.</p>
            </article>
        </div>
</section>
<?php include_once ROOT . "/views/components/footer.php" ?>