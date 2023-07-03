<script src="/script/app.js"></script>
<?php if (isset($_SESSION["open"])): ?>
    <script>openModal("<?= $_SESSION["open"] ?>")</script>
<?php endif; ?>
</body>
</html>