<?php include_once ROOT . "/views/components/nav.php" ?>
<header class="hero-container">
    <div class="hero">
        <h1 class="h1">
            <img src="asset/img/logo-transparent-notext.png" alt="Icytrails logo">
            Icytrails
        </h1>
        <h2 class="h2" data-text="Create, play and share your own levels"><i class="scramble" data-words="Create%c#FF8585;Play%c#3DD6D0;Share%c#97DB4F">Create</i> your own levels</h2>
        <div class="cta">
            <button class="btn" onclick="openModal('register-modal')">Join comunity</button>
            <a class="btn succes-bg" href="/levels">Browse levels</a>
        </div>
    </div>
    <video class="video-bg" src="asset/video/hero-vid.mp4" autoplay muted loop playsinline>
        Your browser does not support HTML5 video...
    </video>
</header>
<div class="video-paralax">
    <section class="create">
        <h2 class="h2">Create your world without any limits</h2>
        <p>Your imagination is the only limit, hop in the level editor and place blocks decoration traps and more !</p>
        <p>And the best part: there is no download required</p>
        <a href="/levels/editor" class="btn">Level editor</a>
        <div class="background-images">
            <img src="asset/img/blockedit.png" alt="Level edition illustration" class="edit-img">
            <img src="asset/img/corner.png" alt="Blocks terrain" class="corner-img">
            <img src="asset/img/hero.png" alt="Icytrails main character" class="hero-img">
            <img src="asset/img/trees.png" alt="trees background" class="trees-img">
        </div>
    </section>
    <div class="split"></div>
    <section class="tuto">
        <h2 class="h2">Easy to learn, hard to master</h2>
        <p>Only 3 movement: left, right and jump. You can't mix it up but it can still get difficult!</p>
        <img src="asset/img/keys-arrow.png" alt="game controls illustration" class="keys active">
        <img src="asset/img/keys-qwerty.png" alt="game controls illustration" class="keys">
        <img src="asset/img/keys-azerty.png" alt="game controls illustration" class="keys">
        <a href="/tuto" class="btn">Play tutorial</a>
        <div class="background-images">
            <img src="asset/img/terrain.png" alt="Terrain illustration background" class="terrain">
            <img src="asset/img/end.png" alt="star illustration" class="star1">
            <img src="asset/img/end.png" alt="star illustration" class="star2">
            <img src="asset/img/end.png" alt="star illustration" class="star3">
        </div>
    </section>
    <div class="split"></div>
    <?php include_once ROOT . "/views/components/footer.php" ?>
</div>