<?php
// Redirect logic
if (!empty($_SERVER['HTTPS']) && ('on' == $_SERVER['HTTPS'])) {
    $uri = 'https://';
} else {
    $uri = 'http://';
}
$uri .= $_SERVER['HTTP_HOST'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="styles/reset.css" type="text/css" rel="stylesheet">
    <link href="styles/global.css" type="text/css" rel="stylesheet">
	<link rel="icon" href="images/favicon.ico" type="image/x-icon">
	<script src="scripts/index.js" defer></script>
	<title>Portfolio</title>
</head>
	<header>
		<h1><span>Timothy</span>
			<span>Scott</span>
			<span>Kipp</span>
		</h1>
		<nav>
			<ul>
				<li><a href="liberty/index.html">Liberty</a></li>
				<li><a href="table_generator/index.html">Tables</a></li>
				<li><a href="calendar_generator/index.html">Calendar</a></li>
				<li><a href="travel/index.html">Travel</a></li>			
				<!-- <li><a href="hotel/index.php">Hotel</a></li> -->
				<!-- <li><a href="store/order.php">Order</a></li>
				<li><a href="tu_young_professionals/index.php">Contact</a></li> -->
			</ul>
		</nav>
	</header>
	<main>

	</main>
	<footer>
		<menu>			
			<img class="color-picker" id="color-picker-color" src="/images/EyeDropperAndColorWheel.png" height="48px">
			<img class="color-picker" id="color-picker-grayscale" src="/images/EyeDropperAndColorWheel_Grayscale.png" height="48px" onclick="showColorPickerDialog();">
		</menu>
        <dialog id="color-picker">
            <form>
                <fieldset id="element-attribute-selection">
                    <legend>Element/Attribute</legend>
                    <select id="element-selectionn">

                    </select>
                    <fieldset id="attribute-selection">                        
                        <input type="radio"><label>Text</label>
                        <input type="radio"><label>Background</label>
                        <input type="radio"><label>Border</label>
                    </fieldset>
                </fieldset>
                <fieldset id="color-selection">
                    <fieldset id="rgb-selection">
                        <legend>RGB Color</legend>
                        <fieldset id="red-selection">
                            <label>Red</label><input type="number" min="0", max="255">
                            <br>
                            <input type="range" min="0", max="255">
                        </fieldset>
                        <fieldset id="green-selection">
                            <label>Green</label><input type="number" min="0", max="255">
                            <br>
                            <input type="range" min="0", max="255">
                        </fieldset>
                        <fieldset id="blue-selection">
                            <label>Blue</label><input type="number" min="0", max="255">
                            <br>
                            <input type="range" min="0", max="255">
                        </fieldset>
                    </fieldset>
                    <label>Hex Color</label><input type="text">
                </fieldset>
				<button type="button" onclick="hideColorPickerDialog()">Close</button>        
            </form>
        </dialog>
	</footer>
</body>
</html>