<?php
if (isset($_POST['calcular'])) {
    $a = $_POST['a'];
    $b = $_POST['b'];

    if ($b != 0) {
        $cociente = intdiv($a, $b);
        $residuo = $a % $b;
    } else {
        $error = "No se puede dividir entre cero";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Cociente y Residuo</title>
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
<div class="contenedor">
    <h2>Cociente y Residuo</h2>

    <form method="post">
        <label>Número A</label>
        <input type="number" name="a" required>

        <label>Número B</label>
        <input type="number" name="b" required>

        <button type="submit" name="calcular">Calcular</button>
    </form>

    <?php if (isset($cociente)) { ?>
        <div class="resultado">
            Cociente: <?= $cociente ?><br>
            Residuo: <?= $residuo ?>
        </div>
    <?php } ?>

    <?php if (isset($error)) { ?>
        <div class="resultado"><?= $error ?></div>
    <?php } ?>
</div>
</body>
</html>

