<?php
function factorial($n) {
    $res = 1;
    for ($i = 1; $i <= $n; $i++) {
        $res *= $i;
    }
    return $res;
}

if (isset($_POST['calcular'])) {
    $numero = $_POST['numero'];
    $resultado = factorial($numero);
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Factorial</title>
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
<div class="contenedor">
    <h2>Función Factorial</h2>

    <form method="post">
        <label>Ingresa un número</label>
        <input type="number" name="numero" min="0" required>

        <button type="submit" name="calcular">Calcular</button>
    </form>

    <?php if (isset($resultado)) { ?>
        <div class="resultado">
            El factorial de <?= $numero ?> es <?= $resultado ?>
        </div>
    <?php } ?>
</div>
</body>
</html>
