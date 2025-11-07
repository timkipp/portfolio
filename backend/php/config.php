<?php
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $local = false;

    // Automatically detect environment
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    // Check for patterns that identify your local setup
    $checks = [
        fn($h) => strcmp($h, 'localhost') === 0,
        fn($h) => str_starts_with($h, '127.0.0.'), 
        fn($h) => str_starts_with($h, '192.168.'),
        fn($h) => str_ends_with($h, '.local')
    ];
    
    foreach ($checks as $check) {
        $local = $check($host) ? true : false;
        if ($local) break;
    }

    if ($local) {
        $DB_HOST = $_ENV['LOCAL_DB_HOST'];
        $DB_USER = $_ENV['LOCAL_DB_USER'];
        $DB_PASS = $_ENV['LOCAL_DB_PASS'];
        $DB_NAME = $_ENV['LOCAL_DB_NAME'];
    } else {
        $DB_HOST = $_ENV['REMOTE_DB_HOST'];
        $DB_USER = $_ENV['REMOTE_DB_USER'];
        $DB_PASS = $_ENV['REMOTE_DB_PASS'];
        $DB_NAME = $_ENV['REMOTE_DB_NAME'];
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