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
<body>
	<header>
		<h1>
            <span>Timothy</span>
			<span>Scott</span>
			<span>Kipp</span>
		</h1>
		</nav>
	</header>
	<main>
        <h1>Résumé</h1>
        <section id="summary">
            <h2>Summary</h2>
            <p>Graduating Information Technology major passionate about programming, graphic design, and web development. Eager to apply my design and coding skills in a collaborative team environment and learn from my peers to expand my skillset.</p>
        </section>
        <section id="education">
            <h2>Education</h2>
            <ul>
                <li>
                    <span>Towson University, Baltimore, MD</span><span><em>Graduated </em>May 2025</span>
                    <ul>
                        <li><span class="degree">Bachelor of Sciece, Information Technology</span><span class="grade">GPA: 3.8</span></li>                        
                        <li class="achievements">Dean's List: Fall 2023, Spring 2024, Fall 2024</li>
                    </ul>
                </li>
                <li>
                    <span>Harford Community College, Bel Air, MD</span><span>Graduated 2023</span>
                    <ul>
                        <li><span class="degree">Associate in Applied Sciences, Computer Information Systems</span><span class="grade">GPA: 3.8</span>
                        <br<span>Certificate, Computer Information Systems Programming</span></li>
                        <li>Dean's List: Spring 2022</li>
                    </ul>
                </li>
            </ul>
        </section>
        <section id="relevant-experience">
            <h2>Relevant Experience</h2>
            <ul>
                <li>Responsive Statue of Liberty Web Page (<span>Harford Community College</span>)
                    <p>Developed a responsive informational web page about the Statue of Liberty to demonstrate proficiency in HTML5 and CSS3 skills. Utilized responsive design techniques such as media queries, CSS Grid, CSS Flexbox, and responsive layout and typography elements to ensure a polished and professional user experience across all device and screen sizes.</p>
                </li>
                <li>
                    Interactive Calendar (<span>Harford Community College</span>)
                    <p>Developed a dynamic web page using HTML5, CSS3, and JavaScript to generate a monthly calendar. Incorporated HTML form controls to facilitate user input for displaying the calendar based on a specific month and year.</p>
                </li>
                <li>
                    Flight Lookup Simulator (<span>Harford Community College</span>)
                    <p>Developed a mockup of a flight lookup web page using HTML5, CSS3, and JavaScript. Integrated programming-driven custom form controls with standard HTML form controls to provide a user interface for inputting travel details and providing summary feedback.</p>
                </li>
                <li>
                    WordPress Plugin (<span>Towson University</span>)
                    <p>Developed a WordPress plugin using HTML and PHP/MySQL to collect information from the user, store that information in a database, send a confirmation email, and retrieve and display that information at a later time. Implemented server-side validation and secured data transmission using POST method and input sanitization techniques.</p>
               </li>
            </ul>
        </section>
        <section id="professional-experience">
            <h2>Professional Experience</h2>
            <ul>
                <li>                    
                    Recruiting Coordinator<span>March 2016–August 2016</span>
                    Career Strategies, Inc. (Los Angeles, CA)
                    <ul>
                        <li>Assessed resumes for potential job candidates and prescreened/interviewed candidates.</li>
                        <li>Proofread and edited candidates’ resumes to enhance content, style, and technical accuracy with industry standards and client expectations.</li>
                        <li>Assisted the rollout of new electronic time-keeping process, streamlining procedures and facilitating a seamless transition from paper to a web-based system.</li>
                    </ul>
                </li>
                <li>
                    Customer Service<span>January 2015–August 2015</span>
                    Semihandmade (Burbank, CA)
                    <ul>
                        <li>Assisted customers in store and at trade shows with selecting and ordering custom cabinet fronts designed for Ikea cabinet systems.</li>
                        <li>Developed Excel spreadsheet application for automating order invoice generation.</li>
                        <li>Prepared bids and contracts for orders procured with clients.</li>
                    </ul>
                </li>                    
                <li>
                    Rooms Coordinator<span>February 2012–August 2014</span>
                    Le Méridien Arlington, A Starwood Hotel<span>(Arlington, VA)</span>
                    <ul>
                        <li>Consolidated and aggregated data from hotel systems in advanced Excel spreadsheet application; used VBA programming to create a user-friendly interface for reviewing, tracking, and analyzing business and operational data in order to expedite client responses and services, as well as team operations.</li>
                        <li>Managed group room blocks for conference services and catering clients.</li>
                        <li>Initiated in-house reservation support for a personalized client experience.</li>
                        <li>Facilitated general administrative duties in order to maximize opportunities for sales, conference services and catering managers to focus on client interactions and deliver the specialized service essential for maintaining a loyal customer base at a luxury hotel.</li>
                    </ul>
                </li>
                <li>
                    Sales & Marketing Coordinator<em>January 2008–February 2012</em>
                    Kimpton Hotels: Hotel Palomar <span>(Washington, DC) /</span> Hotel Palomar Arlington<span>(Arlington, VA)</span>
                    <ul>
                        <li>Built custom reporting queries in Market Vision and analyzed data in Excel to support decision-making for DC-area Kimpton hotels.</li>
                        <li>Designed and delivered PowerPoint training presentations and promotional materials for sales and catering teams.</li>
                        <li>Developed a sales goals dashboard workbook for Directors of Sales and Marketing for calculating quarterly bonuses for sales managers; gave presentation on using the workbook to directors of all DC-area Kimpton Hotels.</li>
                        <li>Created and edited sophisticated Word document templates to streamline the drafting of client-ready correspondence and internal communications.</li>
                    </ul>
                </li>
            </ul>
        </section>
        
	</main>
	<footer>
	</footer>
</body>
</html>