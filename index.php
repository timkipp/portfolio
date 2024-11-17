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
	<title>Portfolio</title>
</head>
<body>
	<header>
		<h1><span>Timothy</span>
			<span>Scott</span>
			<!-- <svg class="writing-effect" viewBox="0 0 400 100">
				<path class="letter-path" d="M10,80 L50,10 L90,80" /> 
				<path class="letter-path" d="M110,80 L150,10 L190,80" /> 
				<path class="letter-path" d="M210,80 L250,10 L290,80" /> 
				<path class="letter-path" d="M310,80 L350,10 L390,80" /> 
				<path class="letter-path" d="M410,80 L450,10 L490,80" />
			</svg> -->
			<span>Kipp</span></h1>
		<nav>
			<ul>
				<li><a href="bank/index.php">Bank</a></li>
				<li><a href="calendar/index.php">Calendar</a></li>
				<li><a href="liberty/index.html">Liberty</a></li>
				<li><a href="store/order.php">Store</a></li>
				<li><a href="travel/index.html">Travel</a></li>			
				<li><a href="tu_young_professionals/index.php">TU Young Professionals</a></li>
			</ul>
		</nav>
	</header>
	<main>

	</main>
</body>
</html>