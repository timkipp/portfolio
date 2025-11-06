<?php
    if ($_SERVER['SERVER_NAME'] == 'localhost') {
        // Local server settings (use localhost for development)
        $servername = 'localhost';
        $username = 'root';
        $password = 'MyL@1M@$$@cr3'; 
        $dbname = 'hotel';
    } else {
        // Live server settings (use the actual server for production)
        $servername = "db.timothyscottkipp.com";
        $username = "timkipp"; 
        $password = "T1pp3c@n03"; 
        $dbname = "hoteldatabase";
    }
    
    

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }