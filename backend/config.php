<?php
    $local = false;

    if ($local) {
        $DB_HOST = 'localhost';
        $DB_USER = 'root';
        $DB_PASS = 'MyC0^ntryT1$OfTh33';
        $DB_NAME = 'timkipp_portfolio';
    } else {
        $DB_HOST = 'db.timothyscottkipp.com';
        $DB_USER = 'tims_portfolio';
        $DB_PASS = '17P@^lR3v3r375';
        $DB_NAME = 'timkipp_portfolio';
    }

    // Path to contact form log file
    $contact_log_file = __DIR__ . "/contact_errors.log";

    // Function to get a database connection
    function get_connection() {
        global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

        $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        return $conn;
    }
?>