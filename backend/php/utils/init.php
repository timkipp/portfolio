<?php
    // init.php
    define('PROJECT_ROOT', realpath(__DIR__ . '/..'));
    
    ob_start();
    require_once __DIR__ . '/config.php'; // dynamic autoload + .env loader

    set_error_handler(function($severity, $message, $file, $line) {
        echo json_encode([
            'success' => false,
            'error' => "$message in $file on line $line"
        ]);
        exit;
    });

    set_exception_handler(function($exception) {
        echo json_encode([
            'success' => false,
            'error' => $exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine()
        ]);
        exit;
    });

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    header('Content-Type: application/json');

    $conn = get_connection();
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'error' => "Connection failed: " . $conn->connect_error]);
        exit;
    }