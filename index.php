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
		<h1>Résumé</h1>
        <section id="summary">
            <h2>Summary</h2>
            <p>Enthusiastic Information Technology major passionate about programming, graphic design, and web development. Eager to apply my design and coding skills in a collaborative team environment and learn from my peers to expand my skillset.</p>
        </section>
        <section id="education">
            <h2>Education</h2>
            <ul>
                <li>
                    <h3>Towson University</h3>
                    <ul>
                        <li>Bachelor of Sciece, Information Technology</li>
                        <li><em>Graduation</em>May 2025</li>
                        <li>GPA: 3.8</li>
                        <li>Dean's List: Fall 2023, Spring 2024</li>
                    </ul>
                </li>
                <li>
                    <h3>Harford Community College</h3>
                    <ul>
                        <li>Associate in Applied Sciences, Computer Information Systems</li>
                        <li>Certificate, Computer Information Systems Programming</li>
                        <li>Graduated 2023</li>
                        <li>GPA: 3.8</li>
                        <li>Dean's List: Spring 2022</li>
                    </ul>
                </li>
            </ul>
        </section>
        <section id="relevant-experience">
            <h2>Relevant Experience</h2>
            <ul>
                <li><h3>Responsive Statue of Liberty Web Page</h3> (<em>Harford Community College</em>)
                    <p>Developed a responsive informational web page about the Statue of Liberty to demonstrate proficiency in HTML5 and CSS3 skills. Utilized responsive design techniques such as media queries, CSS Grid, CSS Flexbox, and responsive layout and typography elements to ensure a polished and professional user experience across all device and screen sizes.</p>
                </li>
                <li>
                    <h3>Interactive Calendar</h3> (<em>Harford Community College</em>)
                    <p>Developed a dynamic web page using HTML5, CSS3, and JavaScript to generate a monthly calendar. Incorporated HTML form controls to facilitate user input for displaying the calendar based on a specific month and year.</p>
                </li>
                <li>
                    <h3>Flight Lookup Simulator</h3> (<em>Harford Community College</em>)
                    <p>Developed a mockup of a flight lookup web page using HTML5, CSS3, and JavaScript. Integrated programming-driven custom form controls with standard HTML form controls to provide a user interface for inputting travel details and providing summary feedback.</p>
                </li>
                <li>
                    <h3>WordPress Plugin</h3> (<em>Towson University</em>)
                    <p>Developed a WordPress plugin using HTML and PHP/MySQL to collect information from the user, store that information in a database, send a confirmation email, and retrieve and display that information at a later time. Implemented server-side validation and secured data transmission using POST method and input sanitization techniques.</p>
               </li>
            </ul>
        </section>
        <section id="professional-experience">
            <h2>Professional Experience</h2>
        </section>
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