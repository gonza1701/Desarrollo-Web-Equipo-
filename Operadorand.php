<?php
if (isset($_POST['mostrar'])) {
    $valores = [true, false];
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tabla AND</title>
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
<div class="contenedor">
    <h2>Tabla de Verdad AND</h2>

    <form method="post">
        <button type="submit" name="mostrar">Mostrar tabla</button>
    </form>

    <?php if (isset($valores)) { ?>
        <div class="resultado">
            <table width="100%" border="1" cellpadding="5">
                <tr>
                    <th>A</th><th>B</th><th>A AND B</th>
                </tr>
                <?php
                foreach ($valores as $a) {
                    foreach ($valores as $b) {
                        echo "<tr>";
                        echo "<td>".($a?1:0)."</td>";
                        echo "<td>".($b?1:0)."</td>";
                        echo "<td>".(($a && $b)?1:0)."</td>";
                        echo "</tr>";
                    }
                }
                ?>
            </table>
        </div>
    <?php } ?>
</div>
</body>
</html>
